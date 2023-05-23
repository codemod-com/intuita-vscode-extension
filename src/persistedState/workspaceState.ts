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

export class WorkspaceState {
	public constructor(private readonly __memento: Memento) {}

	public getExecutionPath(
		codemodHash: CodemodHash,
	): T.These<SyntheticError, string> | null {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		const value = ensureIsString(this.__memento.get(hash));
		if (value === null) {
			return null;
		}

		try {
			const json = JSON.parse(value);
			const decoded = workspaceStateCodec.decode(json);

			if (decoded._tag === 'Left') {
				return null;
			}

			return json as unknown as T.These<SyntheticError, string>;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public setExecutionPath(
		codemodHash: CodemodHash,
		executionPath: T.These<SyntheticError, string>,
	): void {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		this.__memento.update(hash, JSON.stringify(executionPath));
	}
}
