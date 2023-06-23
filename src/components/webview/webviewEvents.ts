import { Command } from 'vscode';
import { JobHash, JobKind } from '../../jobs/types';
export type { Command } from 'vscode';
import * as T from 'fp-ts/These';
import { CodemodHash } from '../../packageJsonAnalyzer/types';
import { CaseHash } from '../../cases/types';
import { ExecutionError, SyntheticError } from '../../errors/types';
import { TabKind } from '../../persistedState/codecs';
import { ExplorerTree } from '../../selectors/selectExplorerTree';
import { CodemodRunsTree } from '../../selectors/selectCodemodRunsTree';
import {
	CodemodNodeHashDigest,
	CodemodTree,
} from '../../selectors/selectCodemodTree';
import { PanelViewProps } from './panelViewProps';
import { _ExplorerNodeHashDigest } from '../../persistedState/explorerNodeCodec';

export type ExecutionPath = T.These<SyntheticError, string>;

export { JobHash };
export { CodemodHash };

export type JobDiffViewProps = Readonly<{
	jobHash: JobHash;
	jobKind: JobKind;
	oldFileContent: string | null;
	newFileContent: string | null;
	oldFileTitle: string | null;
	newFileTitle: string | null;
	// title TO BE REMOVED:
	title: string | null;
}>;

export type RunCodemodsCommand = Readonly<{
	title: string;
	shortenedTitle: string;
	description?: string;
	kind: 'webview.codemodList.dryRunCodemod';
	value: CodemodHash;
}>;

export type CollapsibleWebviews =
	| 'codemodRunsView'
	| 'codemodDiscoveryView'
	| 'changeExplorerView'
	| 'communityView';

export type WebviewMessage =
	| Readonly<{
			kind: 'webview.setPanelViewProps';
			panelViewProps: PanelViewProps;
	  }>
	| Readonly<{
			kind: 'webview.main.setCollapsed';
			collapsed: boolean;
			viewName: CollapsibleWebviews;
	  }>
	| Readonly<{
			kind: 'webview.global.setView';
			value: View;
	  }>
	| Readonly<{
			kind: 'webview.codemodRuns.setView';
			value: View;
	  }>
	| Readonly<{
			kind: 'webview.fileExplorer.setView';
			value: View;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.setView';
			value: View;
	  }>
	| Readonly<{
			kind: 'webview.diffView.focusFile';
			jobHash: JobHash;
	  }>
	| Readonly<{
			kind: 'webview.global.setCodemodExecutionProgress';
			value: number;
			codemodHash: CodemodHash;
	  }>
	| Readonly<{
			kind: 'webview.global.setCodemodExecutionProgressLoop';
			codemodHash: CodemodHash;
	  }>
	| Readonly<{
			kind: 'webview.global.codemodExecutionHalted';
	  }>
	| Readonly<{
			kind: 'webview.codemodList.setAutocompleteItems';
			autocompleteItems: string[];
	  }>
	| Readonly<{
			kind: 'webview.main.setActiveTabId';
			activeTabId: TabKind;
	  }>;

export type WebviewResponse =
	| Readonly<{
			kind: 'webview.global.focusExplorerNode';
			caseHashDigest: CaseHash;
			explorerNodeHashDigest: _ExplorerNodeHashDigest;
	  }>
	| Readonly<{
			kind:
				| 'webview.global.flipSelectedExplorerNode'
				| 'webview.global.flipCollapsibleExplorerNode';
			caseHashDigest: CaseHash;
			explorerNodeHashDigest: _ExplorerNodeHashDigest;
	  }>
	| Readonly<{
			kind: 'webview.global.flipSelectedExplorerNodes';
			caseHashDigest: CaseHash;
	  }>
	| Readonly<{
			kind: 'webview.global.focusExplorerNodeSibling';
			caseHashDigest: CaseHash;
			direction: 'prev' | 'next';
	  }>
	| Readonly<{
			kind: 'webview.panel.focusOnChangeExplorer';
	  }>
	| Readonly<{
			kind: 'webview.command';
			value: Command;
	  }>
	| Readonly<{
			kind: 'webview.global.reportIssue';
			faultyJobHash: JobHash;
			oldFileContent: string;
			newFileContent: string;
	  }>
	| Omit<RunCodemodsCommand, 'title' | 'shortenedTitle' | 'description'>
	| Readonly<{
			kind: 'webview.global.applySelected';
			caseHashDigest: CaseHash;
	  }>
	| Readonly<{
			kind: 'webview.global.setChangeExplorerSearchPhrase';
			caseHashDigest: CaseHash;
			searchPhrase: string;
	  }>
	| Readonly<{
			kind: 'webview.global.setCodemodSearchPhrase';
			searchPhrase: string;
	  }>
	| Readonly<{
			kind: 'webview.global.flipChangeExplorerNodeHashDigests';
			caseHashDigest: CaseHash;
			explorerNodeHashDigest: _ExplorerNodeHashDigest;
	  }>
	| Readonly<{ kind: 'webview.global.showInformationMessage'; value: string }>
	| Readonly<{ kind: 'webview.global.showWarningMessage'; value: string }>
	| Readonly<{
			kind: 'webview.main.setActiveTabId';
			activeTabId: TabKind;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.updatePathToExecute';
			value: {
				newPath: string;
				codemodHash: CodemodHash;
				errorMessage: string | null;
				warningMessage: string | null;
				revertToPrevExecutionIfInvalid: boolean;
			};
	  }>
	| Readonly<{
			kind: 'webview.global.discardChanges';
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.haltCodemodExecution';
			value: CodemodHash;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.codemodPathChange';
			codemodPath: string;
	  }>
	| Readonly<{
			kind: 'webview.campaignManager.setSelectedCaseHash';
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: 'webview.global.selectCodemodNodeHashDigest';
			selectedCodemodNodeHashDigest: CodemodNodeHashDigest;
	  }>
	| Readonly<{
			kind: 'webview.global.flipCodemodHashDigest';
			codemodNodeHashDigest: CodemodNodeHashDigest;
	  }>;

export type View =
	| Readonly<{
			viewId: 'fileExplorer';
			viewProps: ExplorerTree | null;
	  }>
	| Readonly<{
			viewId: 'campaignManagerView';
			viewProps: CodemodRunsTree;
	  }>
	| Readonly<{
			viewId: 'codemods';
			viewProps: {
				codemodTree: CodemodTree;
				autocompleteItems: string[];
				searchPhrase: string;
				rootPath: string;
			};
	  }>
	| Readonly<{
			viewId: 'errors';
			viewProps:
				| Readonly<{
						kind:
							| 'MAIN_WEBVIEW_VIEW_NOT_VISIBLE'
							| 'CODEMOD_RUNS_TAB_NOT_ACTIVE'
							| 'CASE_NOT_SELECTED';
				  }>
				| Readonly<{
						kind: 'CASE_SELECTED';
						caseHash: CaseHash;
						executionErrors: ReadonlyArray<ExecutionError>;
				  }>;
	  }>;
