import * as t from 'io-ts';
import { JobHash } from '../features/moveTopLevelNode/jobHash';
import {
	assertsNeitherNullOrUndefined,
	calculateLastPosition,
	getSeparator,
	IntuitaRange,
} from '../utilities';
import { buildJobUri, IntuitaFileSystem } from './intuitaFileSystem';
import { JobOutput } from '../jobs';
import { JobManager } from './jobManager';
import { MoveTopLevelNodeJob } from '../features/moveTopLevelNode/job';
import { RepairCodeJob } from '../features/repairCode/job';
import { buildTypeCodec, mapValidationToEither } from './inferenceService';
import { withFallback } from 'io-ts-types';
import { pipe } from 'fp-ts/lib/function';
import { orElse } from 'fp-ts/lib/Either';
import { MessageBus, MessageKind } from './messageBus';
import { Uri } from 'vscode';

const argumentCodec = buildTypeCodec({
	hash: t.string,
	characterDifference: withFallback(t.number, 0),
});

export const acceptJob = (
	intuitaFileSystem: IntuitaFileSystem,
	jobManager: JobManager,
	messageBus: MessageBus,
) => {
	const getJobOutput = (
		job: MoveTopLevelNodeJob | RepairCodeJob,
		characterDifference: number,
	): JobOutput => {
		// TODO we should rely on the executeJob return, the rest is not needed

		const content = intuitaFileSystem.readNullableFile(buildJobUri(job));

		if (!content) {
			return jobManager.executeJob(job.hash, characterDifference);
		}

		const text = content.toString();
		const separator = getSeparator(text);

		const position = calculateLastPosition(text, separator);

		// we are replacing the whole file
		const range: IntuitaRange = [0, 0, position[0], position[1]];

		return {
			text,
			position,
			range,
		};
	};

	return async (arg0: unknown, arg1: unknown) => {
		// factor in tree-data commands and regular commands
		const argumentEither = pipe(
			argumentCodec.decode(arg0),
			orElse(() =>
				argumentCodec.decode({
					jobHash: arg0,
					characterDifference: arg1,
				}),
			),
			mapValidationToEither,
		);

		if (argumentEither._tag === 'Left') {
			throw new Error(
				`Could not decode acceptJob arguments: ${argumentEither.left}`,
			);
		}

		const job = jobManager.getJob(argumentEither.right.hash as JobHash);
		assertsNeitherNullOrUndefined(job);

		const jobOutput = getJobOutput(
			job,
			argumentEither.right.characterDifference,
		);

		const uri = Uri.parse(job.fileName);

		messageBus.publish({
			kind: MessageKind.updateExternalFile,
			uri,
			jobOutput,
		})

		// editor operation should work as an event

		// send event externalFileUpdated
		// do nothing if the file has not been given such jobs
		// if it has, recalculate them
	};
};
