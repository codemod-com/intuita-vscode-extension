import { Command } from 'vscode';
import { JobHash, JobKind } from '../../jobs/types';
export type { Command } from 'vscode';
import * as T from 'fp-ts/These';
import { CodemodHash } from '../../packageJsonAnalyzer/types';
import { CaseHash } from '../../cases/types';
import { SyntheticError } from '../../errors/types';
import { CodemodNodeHashDigest } from '../../selectors/selectCodemodTree';
import { PanelViewProps } from './panelViewProps';
import { _ExplorerNodeHashDigest } from '../../persistedState/explorerNodeCodec';
import { MainWebviewViewProps } from '../../selectors/selectMainWebviewViewProps';
import { ActiveTabId } from '../../persistedState/codecs';
import { ErrorWebviewViewProps } from '../../selectors/selectErrorWebviewViewProps';

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
}>;

export type RunCodemodsCommand = Readonly<{
	title: string;
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
			kind: 'webview.error.setProps';
			errorWebviewViewProps: ErrorWebviewViewProps;
	  }>
	| Readonly<{
			kind: 'webview.main.setProps';
			props: MainWebviewViewProps;
	  }>
	| Readonly<{
			kind: 'webview.global.setCodemodExecutionProgress';
			codemodHash: CodemodHash;
			progressKind: 'finite' | 'infinite';
			value: number;
	  }>
	| Readonly<{
			kind: 'webview.global.codemodExecutionHalted';
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
	| Omit<RunCodemodsCommand, 'title' | 'description'>
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
			activeTabId: ActiveTabId;
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
