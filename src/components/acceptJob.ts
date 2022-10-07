import * as t from 'io-ts';
import { JobHash } from '../features/moveTopLevelNode/jobHash';
import { JobManager } from './jobManager';
import { buildTypeCodec, mapValidationToEither } from './inferenceService';
import { withFallback } from 'io-ts-types';
import { pipe } from 'fp-ts/lib/function';
import { orElse } from 'fp-ts/lib/Either';

const argumentCodec = buildTypeCodec({
	jobHash: t.string,
	characterDifference: withFallback(t.number, 0),
});

export const acceptJob = (jobManager: JobManager) => {
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

		jobManager.acceptJob(
			argumentEither.right.jobHash as JobHash,
			argumentEither.right.characterDifference,
		);
	};
};
