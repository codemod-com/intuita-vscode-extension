import type { Memento } from 'vscode';
import type { CodemodHash } from '../packageJsonAnalyzer/types';
import { buildHash } from '../utilities';

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

	public getExecutionPath(codemodHash: CodemodHash): string | null {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		const value = this.__memento.get(hash);

		return ensureIsString(value);
	}

	public setExecutionPath(
		codemodHash: CodemodHash,
		executionPath: string,
	): void {
		const hash = buildWorkspaceStateKeyHash('executionPath', codemodHash);

		this.__memento.update(hash, executionPath);
	}
}
