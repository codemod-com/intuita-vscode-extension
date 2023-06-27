import type { Uri } from 'vscode';
import type { RootState } from '../data';
import { TabKind } from '../persistedState/codecs';
import { selectCodemodRunsTree } from './selectCodemodRunsTree';
import { selectCodemodTree } from './selectCodemodTree';
import { selectExplorerTree } from './selectExplorerTree';

export const selectMainWebviewViewProps = (
	state: RootState,
	rootUri: Uri,
	autocompleteItems: ReadonlyArray<string>,
) => {
	if (state.activeTabId === TabKind.codemods) {
		return {
			activeTabId: state.activeTabId,
			searchPhrase: state.codemodDiscoveryView.searchPhrase,
			autocompleteItems,
			codemodTree: selectCodemodTree(state, rootUri.fsPath),
			rootPath: rootUri.fsPath,
		};
	}

	if (state.activeTabId === TabKind.codemodRuns) {
		return {
			activeTabId: state.activeTabId,
			codemodRunsTree: selectCodemodRunsTree(state),
			changeExplorerTree: selectExplorerTree(state),
		};
	}

	return {
		activeTabId: state.activeTabId,
	};
};

export type MainWebviewViewProps = ReturnType<
	typeof selectMainWebviewViewProps
>;
