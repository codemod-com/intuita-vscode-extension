import type { Uri } from 'vscode';
import type { RootState } from '../data';
import { selectCodemodRunsTree } from './selectCodemodRunsTree';
import { selectCodemodTree, selectPrivateCodemods } from './selectCodemodTree';
import { selectExplorerTree } from './selectExplorerTree';
import { CodemodHash } from '../packageJsonAnalyzer/types';
import { selectSoureControlTabProps } from './selectSoureControlTabProps';

export const selectMainWebviewViewProps = (
	state: RootState,
	rootUri: Uri | null,
	autocompleteItems: ReadonlyArray<string>,
	executionQueue: ReadonlyArray<CodemodHash>,
) => {
	if (state.activeTabId === 'codemods') {
		return {
			activeTabId: state.activeTabId,
			searchPhrase: state.codemodDiscoveryView.searchPhrase,
			autocompleteItems,
			codemodTree: selectCodemodTree(
				state,
				rootUri?.fsPath ?? null,
				executionQueue,
			),
			privateCodemods: selectPrivateCodemods(
				state,
				rootUri?.fsPath ?? null,
				executionQueue,
			),
			rootPath: rootUri?.fsPath ?? null,
			publicRegistryCollapsed:
				state.codemodDiscoveryView.publicRegistryCollapsed,
			privateRegistryCollapsed:
				state.codemodDiscoveryView.privateRegistryCollapsed,
			panelGroupSettings: state.codemodDiscoveryView.panelGroupSettings,
		};
	}

	if (state.activeTabId === 'codemodRuns') {
		return {
			activeTabId: state.activeTabId,
			applySelectedInProgress: state.applySelectedInProgress,
			codemodRunsTree:
				rootUri !== null
					? selectCodemodRunsTree(state, rootUri.fsPath)
					: null,
			changeExplorerTree:
				rootUri !== null
					? selectExplorerTree(state, rootUri.fsPath)
					: null,
			codemodExecutionInProgress: state.caseHashInProgress !== null,
			panelGroupSettings: state.codemodRunsTab.panelGroupSettings,
			resultsCollapsed: state.codemodRunsTab.resultsCollapsed,
			changeExplorerCollapsed:
				state.codemodRunsTab.changeExplorerCollapsed,
		};
	}

	if (state.activeTabId === 'sourceControl') {
		const sourceControlTabProps = selectSoureControlTabProps(state);

		return {
			activeTabId: state.activeTabId,
			title: sourceControlTabProps?.title ?? null,
			body: sourceControlTabProps?.body ?? null,
		};
	}

	return {
		activeTabId: state.activeTabId,
	};
};

export type MainWebviewViewProps = ReturnType<
	typeof selectMainWebviewViewProps
>;
