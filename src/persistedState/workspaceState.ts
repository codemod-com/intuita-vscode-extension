import * as t from 'io-ts';
import type { Memento } from 'vscode';
import type { CodemodHash } from '../packageJsonAnalyzer/types';
import { buildHash } from '../utilities';
import {
	ExecutionError,
	executionErrorCodec,
	SyntheticError,
} from '../errors/types';
import * as T from 'fp-ts/These';
import * as E from 'fp-ts/Either';
import { workspaceStateCodec } from './codecs';
import { pipe } from 'fp-ts/lib/function';
import { CaseHash } from '../cases/types';
import { MessageBus, MessageKind } from '../components/messageBus';

export type WorkspaceStateKeyHash = string & {
	__type: 'WorkspaceStateKeyHash';
};

type WorkspaceStateKeyEnvelope = Readonly<
	| 'recentCodemodHashes'
	| 'openedCodemodHashDigests'
	| 'focusedCodemodHashDigest'
	| 'openedFileExplorerNodeIds'
	| 'focusedFileExplorerNodeId'
	| 'publicCodemodsExpanded'
	| 'selectedCaseHash'
	| {
			kind: 'executionPath';
			codemodHash: string;
	  }
	| {
			kind: 'executionErrors';
			caseHash: CaseHash;
	  }
>;

const buildWorkspaceStateKeyHash = (
	envelope: WorkspaceStateKeyEnvelope,
): WorkspaceStateKeyHash => {
	if (typeof envelope === 'string') {
		return buildHash(envelope) as WorkspaceStateKeyHash;
	}

	if (envelope.kind === 'executionPath') {
		return buildHash(
			[envelope.kind, envelope.codemodHash].join(','),
		) as WorkspaceStateKeyHash;
	}

	if (envelope.kind === 'executionErrors') {
		return buildHash(
			[envelope.kind, envelope.caseHash].join(','),
		) as WorkspaceStateKeyHash;
	}

	throw new Error('Unsupported type of the envelope');
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
		messageBus: MessageBus,
	) {
		messageBus.subscribe(MessageKind.clearState, () => {
			const keys = this.__memento.keys();

			for (const key of keys) {
				this.__memento.update(key, undefined);
			}
		});
	}

	private __buildDefaultExecutionPath(): ExecutionPath {
		return T.right(this.__rootPath);
	}

	public getExecutionPath(codemodHash: CodemodHash): ExecutionPath {
		const hash = buildWorkspaceStateKeyHash({
			kind: 'executionPath',
			codemodHash,
		});

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
		const hash = buildWorkspaceStateKeyHash({
			kind: 'executionPath',
			codemodHash,
		});

		this.__memento.update(hash, JSON.stringify(executionPath));
	}

	// returns the most recently executed 3 codemods
	public getRecentCodemodHashes(): Readonly<CodemodHash[]> {
		const hash = buildWorkspaceStateKeyHash('recentCodemodHashes');

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			return [];
		}

		try {
			const json = JSON.parse(value);
			const validation = t.readonlyArray(t.string).decode(json);

			if (T.isLeft(validation)) {
				throw new Error(
					'The data for the recent codemod hashes is corrupted',
				);
			}

			return validation.right as readonly CodemodHash[];
		} catch (error) {
			// the JSON.parse has likely failed (corrupt data)

			console.error(error);

			return [];
		}
	}

	public setRecentCodemodHashes(codemodHash: CodemodHash): void {
		const hash = buildWorkspaceStateKeyHash('recentCodemodHashes');

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			this.__memento.update(hash, JSON.stringify([codemodHash]));
			return;
		}

		try {
			const json = JSON.parse(value);
			const validation = t.readonlyArray(t.string).decode(json);

			if (T.isLeft(validation)) {
				throw new Error(
					'The data for the recent codemod hashes is corrupted',
				);
			}

			const newHashes = [
				...validation.right.filter((hash) => hash !== codemodHash),
				codemodHash,
			].slice(-3);

			this.__memento.update(hash, JSON.stringify(newHashes));
		} catch (error) {
			// the JSON.parse has likely failed (corrupt data)

			console.error(error);

			return;
		}
	}

	public getOpenedCodemodHashDigests(): ReadonlySet<CodemodHash> {
		const hash = buildWorkspaceStateKeyHash('openedCodemodHashDigests');

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			return new Set();
		}

		const either = pipe(
			E.tryCatch(
				() => JSON.parse(value),
				(e) => e,
			),
			E.flatMap((json) => t.readonlyArray(t.string).decode(json)),
			E.map(
				(hashDigests) =>
					new Set(
						hashDigests.map(
							(hashDigest) => hashDigest as CodemodHash,
						),
					),
			),
		);

		if (E.isLeft(either)) {
			console.error(either.left);

			return new Set();
		}

		return either.right;
	}

	public setOpenedCodemodHashDigests(set: ReadonlySet<CodemodHash>): void {
		const hashDigest = buildWorkspaceStateKeyHash(
			'openedCodemodHashDigests',
		);

		this.__memento.update(hashDigest, JSON.stringify(Array.from(set)));
	}

	public getOpenedFileExplorerNodeIds(): ReadonlySet<string> {
		const hash = buildWorkspaceStateKeyHash('openedFileExplorerNodeIds');

		const value = ensureIsString(this.__memento.get(hash));

		if (value === null) {
			return new Set();
		}

		const either = pipe(
			E.tryCatch(
				() => JSON.parse(value),
				(e) => e,
			),
			E.flatMap((json) => t.readonlyArray(t.string).decode(json)),
			E.map((id) => new Set(id)),
		);

		if (E.isLeft(either)) {
			console.error(either.left);

			return new Set();
		}

		return either.right;
	}

	public setOpenedFileExplorerNodeIds(set: ReadonlySet<string>): void {
		const hashDigest = buildWorkspaceStateKeyHash(
			'openedFileExplorerNodeIds',
		);

		this.__memento.update(hashDigest, JSON.stringify(Array.from(set)));
	}

	public getFocusedFileExplorerNodeId(): string | null {
		const hashDigest = buildWorkspaceStateKeyHash(
			'focusedFileExplorerNodeId',
		);

		return ensureIsString(
			this.__memento.get(hashDigest),
		) as CodemodHash | null;
	}

	public setFocusedFileExplorerNodeId(id: string | null): void {
		const hashDigest = buildWorkspaceStateKeyHash(
			'focusedFileExplorerNodeId',
		);

		this.__memento.update(hashDigest, id);
	}

	public getFocusedCodemodHashDigest(): CodemodHash | null {
		const hashDigest = buildWorkspaceStateKeyHash(
			'focusedCodemodHashDigest',
		);

		return ensureIsString(
			this.__memento.get(hashDigest),
		) as CodemodHash | null;
	}

	public setFocusedCodemodHashDigest(codemodHash: CodemodHash | null): void {
		const hashDigest = buildWorkspaceStateKeyHash(
			'focusedCodemodHashDigest',
		);

		this.__memento.update(hashDigest, codemodHash);
	}

	public getPublicCodemodsExpanded(): boolean {
		const hashDigest = buildWorkspaceStateKeyHash('publicCodemodsExpanded');

		const value = ensureIsString(this.__memento.get(hashDigest));

		return value !== null ? JSON.parse(value) : true;
	}

	public setPublicCodemodsExpanded(expanded: boolean): void {
		const hashDigest = buildWorkspaceStateKeyHash('publicCodemodsExpanded');

		this.__memento.update(hashDigest, JSON.stringify(expanded));
	}

	public getExecutionErrors(
		caseHash: CaseHash,
	): ReadonlyArray<ExecutionError> {
		const hashDigest = buildWorkspaceStateKeyHash({
			kind: 'executionErrors',
			caseHash,
		});

		const value = ensureIsString(this.__memento.get(hashDigest));

		if (value === null) {
			return [];
		}

		const validation = pipe(
			E.tryCatch(
				() => JSON.parse(value),
				(e) => e,
			),
			E.flatMap((json) =>
				t.readonlyArray(executionErrorCodec).decode(json),
			),
		);

		if (E.isLeft(validation)) {
			console.error(validation.left);

			return [];
		}

		return validation.right;
	}

	public setExecutionErrors(
		caseHash: CaseHash,
		executionErrors: ReadonlyArray<ExecutionError>,
	): void {
		const hashDigest = buildWorkspaceStateKeyHash({
			kind: 'executionErrors',
			caseHash,
		});

		this.__memento.update(hashDigest, JSON.stringify(executionErrors));
	}

	public getSelectedCaseHash(): CaseHash | null {
		const hashDigest = buildWorkspaceStateKeyHash('selectedCaseHash');

		const value = ensureIsString(this.__memento.get(hashDigest));

		if (value === null) {
			return null;
		}

		return value as CaseHash;
	}

	public setSelectedCaseHash(caseHash: CaseHash | null): void {
		const hashDigest = buildWorkspaceStateKeyHash('selectedCaseHash');

		if (caseHash === null) {
			this.__memento.update(hashDigest, undefined);
			return;
		}

		this.__memento.update(hashDigest, caseHash);
	}
}
