import type { Memento } from 'vscode';
import type { CodemodHash } from '../packageJsonAnalyzer/types';
import { buildHash } from '../utilities';
import { SyntheticError } from '../errors/types';
import * as T from 'fp-ts/These';
import { stringArrayCodec, workspaceStateCodec } from './codecs';

export type WorkspaceStateKeyHash = string & {
	__type: 'WorkspaceStateKeyHash';
};

const buildWorkspaceStateKeyHash = (
	type: 'executionPath' | 'recentCodemodHashes',
	codemodHash?: CodemodHash,
): WorkspaceStateKeyHash => {
	if (type === 'executionPath' && codemodHash) {
		return buildHash(
			[type, codemodHash].join(','),
		) as WorkspaceStateKeyHash;
	}

	return buildHash(type) as WorkspaceStateKeyHash;
};

const ensureIsString = (value: unknown): string | null => {
	if (typeof value === 'string') {
		return value;
	}

	return null;
};

export type ExecutionPath = T.These<SyntheticError, string>;

export class WorkspaceState {
	public constructor(
		private readonly __memento: Memento,
		private readonly __rootPath: string,
	) {}

	private __buildDefaultExecutionPath(): ExecutionPath {
		return T.right(this.__rootPath);
	}

	public getExecutionPath(codemodHash: CodemodHash): ExecutionPath {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			// do not persist default values
			return this.__buildDefaultExecutionPath();
		}

		try {
			const json = JSON.parse(value);
			const validation = workspaceStateCodec.decode(json);

			if (T.isLeft(validation)) {
				throw new Error(
					'The data for the execution path of the codemod hash ${codemodHash} is corrupted',
				);
			}

			return validation.right;
		} catch (error) {
			// the JSON.parse has likely failed (corrupt data)

			console.error(error);

			// do not persist default values
			return this.__buildDefaultExecutionPath();
		}
	}

	public setExecutionPath(
		codemodHash: CodemodHash,
		executionPath: ExecutionPath,
	): void {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		this.__memento.update(hash, JSON.stringify(executionPath));
	}

	public getRecentCodemodHashes(): Readonly<string[]> {
		const hash = buildWorkspaceStateKeyHash('recentCodemodHashes');

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			return [];
		}

		try {
			const json = JSON.parse(value);
			const validation = stringArrayCodec.decode(json);

			if (T.isLeft(validation)) {
				throw new Error(
					'The data for the recent codemod hashes is corrupted',
				);
			}

			return validation.right;
		} catch (error) {
			// the JSON.parse has likely failed (corrupt data)

			console.error(error);

			return [];
		}
	}

	public setRecentCodemodHashes(hashDigest: string): void {
		const hash = buildWorkspaceStateKeyHash('recentCodemodHashes');

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			this.__memento.update(hash, JSON.stringify([hashDigest]));
			return;
		}

		try {
			const json = JSON.parse(value);
			const validation = stringArrayCodec.decode(json);

			if (T.isLeft(validation)) {
				throw new Error(
					'The data for the recent codemod hashes is corrupted',
				);
			}

			const newHashes = [
				...validation.right.filter((hash) => hash !== hashDigest),
				hashDigest,
			];

			this.__memento.update(hash, JSON.stringify(newHashes));
		} catch (error) {
			// the JSON.parse has likely failed (corrupt data)

			console.error(error);

			return;
		}
	}
}
