import type { Memento } from 'vscode';
import type { CodemodHash } from '../packageJsonAnalyzer/types';
import { buildHash } from '../utilities';
import { SyntheticError } from '../errors/types';
import * as T from 'fp-ts/These';
import { workspaceStateCodec } from './codecs';

export type WorkspaceStateKeyHash = string & {
	__type: 'WorkspaceStateKeyHash';
};

const buildWorkspaceStateKeyHash = (
	type: 'executionPath',
	codemodHash: CodemodHash,
): WorkspaceStateKeyHash => {
	return buildHash([type, codemodHash].join(',')) as WorkspaceStateKeyHash;
};

const ensureIsString = (value: unknown): string | null => {
	if (typeof value === 'string') {
		return value;
	}

	return null;
};

type ExecutionPath = T.These<SyntheticError, string>;

export class WorkspaceState {
	public constructor(
		private readonly __memento: Memento,
		private readonly __rootPath: string,
	) {}

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

	private __buildDefaultExecutionPath(): ExecutionPath {
		return T.right(this.__rootPath);
	}

	public setExecutionPath(
		codemodHash: CodemodHash,
		executionPath: ExecutionPath,
	): void {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		this.__memento.update(hash, JSON.stringify(executionPath));
	}
}
