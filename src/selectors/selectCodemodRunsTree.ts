import { RootState } from '../data';
import { isNeitherNullNorUndefined } from '../utilities';

export const selectCodemodRunsTree = (state: RootState) => {
	const { selectedCaseHash } = state.codemodRunsView;

	const nodeData = Object.values(state.case.entities)
		.filter(isNeitherNullNorUndefined)
		.sort((a, b) =>
			a.codemodName
				.toLocaleLowerCase()
				.localeCompare(b.codemodName.toLocaleLowerCase()),
		)
		.map(
			(kase) =>
				({
					node: {
						hashDigest: kase.hash,
						label: kase.codemodName,
					} as const,
					depth: 0,
					expanded: true,
					focused: kase.hash === selectedCaseHash,
					childCount: 0,
				} as const),
		);

	return {
		nodeData,
		selectedNodeHashDigest: selectedCaseHash,
	} as const;
};

export type CodemodRunsTree = ReturnType<typeof selectCodemodRunsTree>;