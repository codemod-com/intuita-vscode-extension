import { CaseHash } from '../cases/types';
import { RootState } from '../data';
import { isNeitherNullNorUndefined } from '../utilities';

export const selectSearchPhrase = (state: RootState, caseHash: CaseHash) =>
	(state.explorerSearchPhrases[caseHash] ?? '').trim().toLocaleLowerCase();

export const selectNodeData = (state: RootState, caseHash: CaseHash) => {
	const collapsedExplorerNodes = state.collapsedExplorerNodes[caseHash] ?? [];

	const properSearchPhrase = selectSearchPhrase(state, caseHash);

	let maximumDepth = Number.MAX_SAFE_INTEGER;

	return (
		state.explorerNodes[caseHash]
			?.map((node) => {
				if (properSearchPhrase !== '') {
					if (
						node.kind !== 'FILE' ||
						!node.path
							.toLocaleLowerCase()
							.includes(properSearchPhrase)
					) {
						return null;
					}

					return {
						node: {
							...node,
							label: node.path,
						},
						depth: 0,
						expanded: false,
						focused:
							state.focusedExplorerNodes[caseHash] ===
							node.hashDigest,
						collapsable: false,
					};
				}

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

	const caseHash = state.codemodRunsView.selectedCaseHash as CaseHash | null;

	if (caseHash === null) {
		return null;
	}

	const kase = state.case.entities[caseHash] ?? null;

	if (kase === null) {
		return null;
	}

	const nodeData = selectNodeData(state, caseHash);

	const fileNodeData = nodeData.filter(({ node }) => node.kind === 'FILE');

	const selectedExplorerNodeHashDigests =
		state.selectedExplorerNodes[caseHash] ?? [];
	const selectedJobCount = fileNodeData.filter(({ node }) =>
		selectedExplorerNodeHashDigests.includes(node.hashDigest),
	).length;

	return {
		caseHash,
		nodeData,
		focusedNodeHashDigest: state.focusedExplorerNodes[caseHash] ?? null,
		collapsedNodeHashDigests: state.collapsedExplorerNodes[caseHash] ?? [],
		selectedExplorerNodeHashDigests,
		searchPhrase: state.explorerSearchPhrases[caseHash] ?? '',
		selectedJobCount,
	};
};

export type ExplorerTree = NonNullable<ReturnType<typeof selectExplorerTree>>;
