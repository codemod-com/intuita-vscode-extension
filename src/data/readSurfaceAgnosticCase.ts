import EventEmitter from 'node:events';
import type { ReadStream } from 'node:fs';
import {
	parseJobKind,
	type SurfaceAgnosticJob,
} from './schemata/surfaceAgnosticJobSchema';
import { SurfaceAgnosticCase } from './schemata/surfaceAgnosticCaseSchema';
import { createHash, Hash } from 'node:crypto';
import { parseArgumentRecordSchema } from './schemata/argumentRecordSchema';

type OuterData = Readonly<{
	byteLength: number;
	hashDigest: Buffer;
	innerData: Buffer;
}>;

type OuterCase = OuterData & { kind: 'case' };

type OuterJob = OuterData & { kind: 'job' };

const buildCase = (outerCase: OuterCase): SurfaceAgnosticCase => {
	const innerDataHashDigest = createHash('ripemd160')
		.update(outerCase.innerData)
		.digest();

	if (Buffer.compare(innerDataHashDigest, outerCase.hashDigest) !== 0) {
		throw new Error(
			"The inner case's hash digest does not match the calculated hash digest",
		);
	}

	const caseHashDigest = outerCase.innerData
		.subarray(0, 20)
		.toString('base64url');
	const codemodHashDigest = outerCase.innerData
		.subarray(20, 40)
		.toString('base64url');

	const createdAt = outerCase.innerData.subarray(40, 48).readBigInt64BE();

	const pathByteLength = outerCase.innerData.subarray(48, 50).readUint16BE();

	const recordByteLengthStart = 50 + pathByteLength;

	const absoluteTargetPath = outerCase.innerData
		.subarray(50, recordByteLengthStart)
		.toString();

	const recordByteLength = outerCase.innerData
		.subarray(recordByteLengthStart, recordByteLengthStart + 2)
		.readUint16BE();

	const record = outerCase.innerData
		.subarray(
			recordByteLengthStart + 2,
			recordByteLengthStart + 2 + recordByteLength,
		)
		.toString();

	const argumentRecord = parseArgumentRecordSchema(JSON.parse(record));

	return {
		caseHashDigest,
		codemodHashDigest,
		createdAt,
		absoluteTargetPath,
		argumentRecord,
	};
};

const buildJob = (outerJob: OuterJob): SurfaceAgnosticJob => {
	const innerDataHashDigest = createHash('ripemd160')
		.update(outerJob.innerData)
		.digest();

	if (Buffer.compare(innerDataHashDigest, outerJob.hashDigest) !== 0) {
		throw new Error(
			"The inner job's hash digest does not match the calculated hash digest",
		);
	}

	const jobHashDigest = outerJob.innerData
		.subarray(0, 20)
		.toString('base64url');

	const kind = parseJobKind(outerJob.innerData.subarray(20).readUInt8());
	const oldUriByteLength = outerJob.innerData.subarray(21, 23).readUint16BE();

	const newUriByteLengthStart = 23 + oldUriByteLength;

	const oldUri = outerJob.innerData
		.subarray(23, newUriByteLengthStart)
		.toString();

	const newUriByteLength = outerJob.innerData
		.subarray(newUriByteLengthStart, newUriByteLengthStart + 2)
		.readUint16BE();

	const newUri = outerJob.innerData
		.subarray(
			newUriByteLengthStart + 2,
			newUriByteLengthStart + 2 + newUriByteLength,
		)
		.toString();

	return {
		jobHashDigest,
		kind,
		oldUri,
		newUri,
	};
};

const enum POSITION {
	BEFORE_OUTER_PREAMBLE = 0,
	BEFORE_VERSION = 1,
	BEFORE_INNER_CASE_BYTE_LENGTH = 2,
	BEFORE_INNER_CASE_HASH_DIGEST = 3,
	BEFORE_INNER_CASE = 4,
	BEFORE_OUTER_JOB_OR_POSTAMBLE = 5,
	BEFORE_INNER_JOB_BYTE_LENGTH = 6,
	BEFORE_INNER_JOB_HASH_DIGEST = 7,
	BEFORE_INNER_JOB = 8,
	BEFORE_POSTAMBLE_HASH_DIGEST = 9,
}

type State = Readonly<{
	position: POSITION;
	outerCase: OuterCase | null;
	outerJob: OuterJob | null;
	hashOfHashDigests: Hash;
}>;

type StateRecipe =
	| Readonly<{
			event: 'error';
			error: Error;
	  }>
	| (Readonly<{
			event: 'case';
			surfaceAgnosticCase: SurfaceAgnosticCase;
	  }> &
			State)
	| (Readonly<{
			event: 'job';
			surfaceAgnosticJob: SurfaceAgnosticJob;
	  }> &
			State)
	| Readonly<{
			event: 'end';
	  }>
	| State;

const read = (readStream: ReadStream, state: State): StateRecipe | null => {
	if (state.position === POSITION.BEFORE_OUTER_PREAMBLE) {
		const buffer = readStream.read(4);

		if (!Buffer.isBuffer(buffer)) {
			return null;
		}

		if (Buffer.compare(buffer, Buffer.from('INTC')) !== 0) {
			return {
				event: 'error',
				error: new Error(
					'You tried to read a file that is not Intuita Case',
				),
			};
		}

		return {
			...state,
			position: POSITION.BEFORE_VERSION,
		};
	}

	if (state.position === POSITION.BEFORE_VERSION) {
		const buffer = readStream.read(4);

		if (!Buffer.isBuffer(buffer)) {
			return null;
		}

		if (Buffer.compare(buffer, new Uint8Array([1, 0, 0, 0])) !== 0) {
			return {
				event: 'error',
				error: new Error(),
			};
		}

		return {
			...state,
			position: POSITION.BEFORE_INNER_CASE_BYTE_LENGTH,
		};
	}

	if (state.position === POSITION.BEFORE_INNER_CASE_BYTE_LENGTH) {
		const buffer = readStream.read(2);

		if (!Buffer.isBuffer(buffer)) {
			return null;
		}

		return {
			...state,
			outerCase: {
				kind: 'case',
				byteLength: buffer.readUint16BE(),
				hashDigest: Buffer.from([]),
				innerData: Buffer.from([]),
			},
			position: POSITION.BEFORE_INNER_CASE_HASH_DIGEST,
		};
	}

	if (
		state.position === POSITION.BEFORE_INNER_CASE_HASH_DIGEST &&
		state.outerCase !== null
	) {
		const hashDigest = readStream.read(20);

		if (!Buffer.isBuffer(hashDigest)) {
			return null;
		}

		const hashOfHashDigests = state.hashOfHashDigests.update(hashDigest);

		return {
			...state,
			outerCase: {
				...state.outerCase,
				hashDigest,
			},
			hashOfHashDigests,
			position: POSITION.BEFORE_INNER_CASE,
		};
	}

	if (
		state.position === POSITION.BEFORE_INNER_CASE &&
		state.outerCase !== null
	) {
		const innerCase = readStream.read(state.outerCase.byteLength);

		if (!Buffer.isBuffer(innerCase)) {
			return null;
		}

		try {
			const surfaceAgnosticCase = buildCase({
				...state.outerCase,
				innerData: innerCase,
			});

			return {
				...state,
				outerCase: null,
				position: POSITION.BEFORE_OUTER_JOB_OR_POSTAMBLE,
				event: 'case',
				surfaceAgnosticCase,
			};
		} catch (error) {
			return {
				event: 'error',
				error:
					error instanceof Error
						? error
						: new Error('Unknown case creation error'),
			};
		}
	}

	if (state.position === POSITION.BEFORE_OUTER_JOB_OR_POSTAMBLE) {
		const buffer = readStream.read(4);

		if (!Buffer.isBuffer(buffer)) {
			return null;
		}

		if (Buffer.compare(buffer, Buffer.from('INTJ')) === 0) {
			return {
				...state,
				position: POSITION.BEFORE_INNER_JOB_BYTE_LENGTH,
			};
		}

		if (Buffer.compare(buffer, Buffer.from('INTE')) === 0) {
			return {
				...state,
				position: POSITION.BEFORE_POSTAMBLE_HASH_DIGEST,
			};
		}

		return {
			event: 'error',
			error: new Error(
				'Could not recognize neither INTJ or INTE headers',
			),
		};
	}

	if (state.position === POSITION.BEFORE_INNER_JOB_BYTE_LENGTH) {
		const buffer = readStream.read(2);

		if (!Buffer.isBuffer(buffer)) {
			return null;
		}

		return {
			...state,
			outerJob: {
				kind: 'job',
				byteLength: buffer.readUint16BE(),
				hashDigest: Buffer.from([]),
				innerData: Buffer.from([]),
			},
			position: POSITION.BEFORE_INNER_JOB_HASH_DIGEST,
		};
	}

	if (
		state.position === POSITION.BEFORE_INNER_JOB_HASH_DIGEST &&
		state.outerJob !== null
	) {
		const hashDigest = readStream.read(20);

		if (!Buffer.isBuffer(hashDigest)) {
			return null;
		}

		const hashOfHashDigests = state.hashOfHashDigests.update(hashDigest);

		return {
			...state,
			outerJob: {
				...state.outerJob,
				hashDigest,
			},
			hashOfHashDigests,
			position: POSITION.BEFORE_INNER_JOB,
		};
	}

	if (
		state.position === POSITION.BEFORE_INNER_JOB &&
		state.outerJob !== null
	) {
		const innerJob = readStream.read(state.outerJob.byteLength);

		if (!Buffer.isBuffer(innerJob)) {
			return null;
		}

		try {
			const surfaceAgnosticJob = buildJob({
				...state.outerJob,
				innerData: innerJob,
			});

			return {
				...state,
				position: POSITION.BEFORE_OUTER_JOB_OR_POSTAMBLE,
				outerJob: null,
				event: 'job',
				surfaceAgnosticJob,
			};
		} catch (error) {
			return {
				event: 'error',
				error:
					error instanceof Error
						? error
						: new Error('Unknown job creation error'),
			};
		}
	}

	if (state.position === POSITION.BEFORE_POSTAMBLE_HASH_DIGEST) {
		const hashDigest = readStream.read(20);

		if (!Buffer.isBuffer(hashDigest)) {
			return null;
		}

		if (
			Buffer.compare(hashDigest, state.hashOfHashDigests.digest()) !== 0
		) {
			return {
				event: 'error',
				error: new Error(
					'The read hash of hash digests does not match the calculated one',
				),
			};
		}

		return {
			event: 'end',
		};
	}

	return null;
};

export const readSurfaceAgnosticCase = (readStream: ReadStream) => {
	const eventEmitter = new EventEmitter();

	let reading = true;

	let state: State = {
		position: POSITION.BEFORE_OUTER_PREAMBLE,
		outerCase: null,
		outerJob: null,
		hashOfHashDigests: createHash('ripemd160'),
	};

	const readableCallback = () => {
		try {
			while (
				readStream.readableLength !== 0 &&
				readStream.readable &&
				reading
			) {
				const stateRecipe = read(readStream, state);

				if (stateRecipe === null) {
					break;
				}

				if ('event' in stateRecipe && stateRecipe.event === 'error') {
					readStream.close();
					eventEmitter.emit('error', stateRecipe.error);
					return;
				}

				if ('event' in stateRecipe && stateRecipe.event === 'end') {
					readStream.close();
					eventEmitter.emit('end');
					return;
				}

				state = {
					position: stateRecipe.position,
					outerCase: stateRecipe.outerCase,
					outerJob: stateRecipe.outerJob,
					hashOfHashDigests: stateRecipe.hashOfHashDigests,
				};

				if ('event' in stateRecipe && stateRecipe.event === 'case') {
					eventEmitter.emit('case', stateRecipe.surfaceAgnosticCase);
				}

				if ('event' in stateRecipe && stateRecipe.event === 'job') {
					eventEmitter.emit('job', stateRecipe.surfaceAgnosticJob);
				}
			}

			readStream.once('readable', readableCallback);
		} catch (error) {
			eventEmitter.emit('error', error);
		}
	};

	readStream.once('readable', readableCallback);

	eventEmitter.once('close', () => {
		reading = false;

		eventEmitter.emit('end');
	});

	return eventEmitter;
};
