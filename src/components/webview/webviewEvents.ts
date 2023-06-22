import { Command } from 'vscode';
import { JobHash, JobKind } from '../../jobs/types';
import { ElementHash } from '../../elements/types';
export type { Command } from 'vscode';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/These';
import { CodemodHash } from '../../packageJsonAnalyzer/types';
import { CaseHash } from '../../cases/types';
import { ExecutionError, SyntheticError } from '../../errors/types';
import { TabKind } from '../../persistedState/codecs';
import {
	ExplorerNodeHashDigest,
	ExplorerTree,
} from '../../selectors/selectExplorerTree';
import { CodemodNodeHashDigest } from '../../selectors/selectCodemodTree';

export type ExecutionPath = T.These<SyntheticError, string>;

export { JobHash };
export { CodemodHash };
export type JobActionCommands =
	| 'intuita.rejectJob'
	| 'intuita.acceptJob'
	| 'intuita.unapplyJob'
	| 'intuita.applyJob';

export type JobAction = {
	title: string;
	command: JobActionCommands;
	arguments: JobHash[];
};
export type JobDiffViewProps = Readonly<{
	jobHash: JobHash;
	jobKind: JobKind;
	oldFileContent: string | null;
	newFileContent: string | null;
	oldFileTitle: string | null;
	newFileTitle: string | null;
	title: string | null;
}>;

export type CommitChangesFormData = Readonly<{
	remoteUrl: string;
	currentBranchName: string;
	newBranchName: string;
	commitMessage: string;
	createNewBranch: boolean;
	stagedJobs: { hash: string; label: string }[];
	pullRequestTitle: string;
	pullRequestBody: string;
}>;

export type RunCodemodsCommand = Readonly<{
	title: string;
	shortenedTitle: string;
	description?: string;
	kind: 'webview.codemodList.dryRunCodemod';
	value: CodemodHash;
}>;

export type CodemodTreeNode = {
	id: CodemodHash;
	kind: 'codemodItem' | 'path';
	uri: string;
	label: string;
	children: CodemodTreeNode[];
	depth: number;
	description?: string;
	parentId: CodemodHash | null;
	iconName?: string;
	command?: Command;
	doubleClickCommand?:
		| Command & {
				command: 'intuita.showCodemodMetadata';
				arguments: [string];
		  };
	actions?: RunCodemodsCommand[];
	executionPath?: ExecutionPath;
	modKind?: 'repomod' | 'executeCodemod';
};

export type CodemodTree = E.Either<SyntheticError, O.Option<CodemodTreeNode>>;

export type ChangeExplorerTree = O.Option<TreeNode>;

export type CaseTreeNode = {
	id: CaseHash;
	kind: 'caseElement';
	label?: string;
	iconName: 'case.svg';
	commands?: [
		Command & {
			command: 'intuita.openCaseDiff';
			arguments?: ElementHash[];
		},
		Command & {
			command: 'intuita.openChangeExplorer';
			arguments?: CaseHash[];
		},
	];
	actions?: Command[];
	children: TreeNode[];
	caseApplied: boolean;
};

export type TreeNodeId = string & { __TreeNodeId: '__TreeNodeId' };

export type TreeNode = {
	id: TreeNodeId;
	kind: string;
	label?: string;
	iconName?: string;
	command?:
		| Command & {
				command: 'intuita.openCaseDiff';
				arguments?: ElementHash[];
		  };
	actions?: Command[];
	children: TreeNode[];
	depth: number;
	parentId: TreeNodeId | null;
};

export type FileTreeNode = TreeNode & {
	jobHash: JobHash;
};

export type ExternalLink = {
	id: string;
	text: string;
	url: string;
};

export type CollapsibleWebviews =
	| 'codemodRunsView'
	| 'codemodDiscoveryView'
	| 'changeExplorerView'
	| 'communityView';

export type WebviewMessage =
	| Readonly<{
			kind: 'webview.global.setUserAccount';
			value: string | null;
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
			kind: 'webview.global.focusView';
			nodeIdToFocus: string | null;
	  }>
	| Readonly<{
			kind: 'webview.diffView.focusFile';
			jobHash: JobHash;
	  }>
	| Readonly<{
			kind: 'webview.diffView.focusFolder';
			folderPath: string;
	  }>
	| Readonly<{
			kind: 'webview.createIssue.submittingIssue';
			value: boolean;
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
			kind: 'webview.codemods.focusCodemod';
			codemodHashDigest: CodemodHash;
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
			kind: 'webview.createIssue.submitIssue';
			value: {
				title: string;
				body: string;
				remoteUrl: string;
			};
	  }>
	| Readonly<{
			kind: 'webview.global.redirectToSignIn';
	  }>
	| Readonly<{
			kind: 'webview.global.openConfiguration';
	  }>
	| Readonly<{
			kind: 'webview.global.afterWebviewMounted';
	  }>
	| Readonly<{
			kind: 'webview.codemodList.afterWebviewMounted';
	  }>
	| Readonly<{
			kind: 'webview.command';
			value: Command;
	  }>
	| Readonly<{
			kind: JobActionCommands;
			value: JobHash[];
	  }>
	| Readonly<{
			kind: 'webview.global.closeView';
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
			jobHashes: ReadonlyArray<JobHash>;
			diffId: string;
	  }>
	| Readonly<{
			kind: 'webview.global.stageJobs';
			jobHashes: ReadonlyArray<JobHash>;
	  }>
	| Readonly<{
			kind: 'webview.global.setChangeExplorerSearchPhrase';
			searchPhrase: string;
	  }>
	| Readonly<{
			kind: 'webview.global.selectExplorerNodeHashDigest';
			selectedExplorerNodeHashDigest: ExplorerNodeHashDigest;
	  }>
	| Readonly<{
			kind: 'webview.global.flipChangeExplorerNodeIds';
			hashDigest: ExplorerNodeHashDigest;
	  }>
	| Readonly<{ kind: 'webview.global.showInformationMessage'; value: string }>
	| Readonly<{ kind: 'webview.global.showWarningMessage'; value: string }>
	| Readonly<{
			kind: 'webview.global.focusView';
			webviewName:
				| 'changeExplorer'
				| 'codemodRuns'
				| 'codemodDiscovery'
				| 'diffView';
	  }>
	| Readonly<{
			kind: 'webview.fileExplorer.disposeView';
			webviewName: 'diffView';
	  }>
	| Readonly<{
			kind: 'webview.fileExplorer.folderSelected';
			id: TreeNodeId;
	  }>
	| Readonly<{
			kind: 'webview.fileExplorer.fileSelected';
			id: TreeNodeId;
	  }>
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
			kind: 'webview.codemods.setState';
			openedIds: ReadonlyArray<CodemodHash>;
			focusedId: CodemodHash | null;
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
			viewId: 'createIssue';
			viewProps: {
				error: string;
				loading: boolean;
				initialFormData: Partial<{
					title: string;
					body: string;
					remoteUrl: string;
				}>;
				remoteOptions: string[];
			};
	  }>
	| Readonly<{
			viewId: 'fileExplorer';
			viewProps: ExplorerTree | null;
	  }>
	| Readonly<{
			viewId: 'communityView';
			viewProps: {
				externalLinks: ExternalLink[];
			};
	  }>
	| Readonly<{
			viewId: 'campaignManagerView';
			viewProps: {
				selectedCaseHash: CaseHash | null;
				nodes: CaseTreeNode[];
			};
	  }>
	| Readonly<{
			viewId: 'jobDiffView';
			viewProps: {
				diffId: string;
				title: string;
				loading: boolean;
				data: JobDiffViewProps[];
				stagedJobs: JobHash[];
			};
	  }>
	| Readonly<{
			viewId: 'commitView';
			viewProps: {
				loading: boolean;
				error: string;
				remoteOptions: string[];
				initialFormData: Partial<CommitChangesFormData>;
			};
	  }>
	| Readonly<{
			viewId: 'codemods';
			viewProps: {
				codemodTree: CodemodTree;
				autocompleteItems: string[];
				openedIds: ReadonlyArray<CodemodHash>;
				focusedId: CodemodHash | null;
				nodeIds: ReadonlyArray<CodemodHash>;
				nodesByDepth: ReadonlyArray<ReadonlyArray<CodemodTreeNode>>;
			};
	  }>
	| Readonly<{
			viewId: 'errors';
			viewProps: Readonly<{
				caseHash: CaseHash | null;
				executionErrors: ReadonlyArray<ExecutionError>;
			}>;
	  }>;
