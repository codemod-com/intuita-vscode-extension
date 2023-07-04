import { CaseHash } from '../cases/types';
import { RootState } from '../data';
import { _ExplorerNode } from '../persistedState/explorerNodeCodec';
import { isNeitherNullNorUndefined } from '../utilities';

export const selectSearchPhrase = (state: RootState, caseHash: CaseHash) =>
	(state.explorerSearchPhrases[caseHash] ?? '').trim().toLocaleLowerCase();

export const selectNodeData = (state: RootState, caseHash: CaseHash) => {
	const collapsedExplorerNodes = state.collapsedExplorerNodes[caseHash] ?? [];

	let maximumDepth = Number.MAX_SAFE_INTEGER;

	return (
		state.explorerNodes[caseHash]
			?.map((node) => {
				if (maximumDepth < node.depth) {
					return null;
				}

				if (maximumDepth === node.depth) {
					maximumDepth = Number.MAX_SAFE_INTEGER;
				}

				const collapsed =
					node.kind !== 'FILE' &&
					collapsedExplorerNodes.includes(node.hashDigest);

				if (collapsed) {
					maximumDepth = node.depth;
				}

				return {
					node,
					depth: node.depth,
					expanded: !collapsed,
					focused:
						state.focusedExplorerNodes[caseHash] ===
						node.hashDigest,
					collapsable: node.kind !== 'FILE',
				};
			})
			.filter(isNeitherNullNorUndefined) ?? []
	);
};

export const selectExplorerTree = (state: RootState) => {
	if (state.codemodExecutionInProgress) {
		return null;
	}

	const caseHash = state.codemodRunsTab.selectedCaseHash as CaseHash | null;

	if (caseHash === null) {
		return null;
	}

	const kase = state.case.entities[caseHash] ?? null;

	if (kase === null) {
		return null;
	}

	const nodeData = selectNodeData(state, caseHash);
	const nodes = state.explorerNodes[caseHash] ?? [];

	const fileNodes = nodes.filter(
		(node): node is _ExplorerNode & { kind: 'FILE' } =>
			node.kind === 'FILE',
	);

	const selectedExplorerNodeHashDigests =
		state.selectedExplorerNodes[caseHash] ?? [];

	const selectedFiles = fileNodes.filter((node) =>
		selectedExplorerNodeHashDigests.includes(node.hashDigest),
	);

	const selectedJobHashes = selectedFiles.map(({ jobHash }) => jobHash);

	return {
		caseHash,
		nodeData,
		focusedNodeHashDigest: state.focusedExplorerNodes[caseHash] ?? null,
		collapsedNodeHashDigests: state.collapsedExplorerNodes[caseHash] ?? [],
		selectedExplorerNodeHashDigests,
		searchPhrase: state.explorerSearchPhrases[caseHash] ?? '',
		selectedJobHashes,
		selectedJobCount: selectedFiles.length,
	};
};

export type ExplorerTree = NonNullable<ReturnType<typeof selectExplorerTree>>;
