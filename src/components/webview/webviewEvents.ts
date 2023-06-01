import { Command } from 'vscode';
import { JobHash, JobKind } from '../../jobs/types';
import { ElementHash } from '../../elements/types';
export type { Command } from 'vscode';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { CodemodHash } from '../../packageJsonAnalyzer/types';
import { CaseHash } from '../../cases/types';
import { SyntheticError } from '../../errors/types';
import { ExecutionPath } from '../../persistedState/workspaceState';

export { JobHash };
export { CodemodHash };
export type JobActionCommands =
	| 'intuita.rejectJob'
	| 'intuita.createIssue'
	| 'intuita.createPR'
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
	description?: string;
	iconName?: string;
	command?:
		| Command & {
				command: 'intuita.showCodemodMetadata';
				arguments: [string];
		  };
	actions?: RunCodemodsCommand[];
	executionPath?: ExecutionPath;
	modKind?: 'repomod' | 'executeCodemod';
};

export type CodemodTree = E.Either<SyntheticError, O.Option<CodemodTreeNode>>;

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

export type TreeNode = {
	id: string;
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
};

export type FileTreeNode = TreeNode & {
	jobHash: JobHash;
};

export type ExternalLink = {
	text: string;
	icon: string;
	url: string;
};

export type WebviewMessage =
	| Readonly<{
			kind: 'webview.global.setUserAccount';
			value: string | null;
	  }>
	| Readonly<{
			kind: 'webview.global.setView';
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
			kind: 'webview.campaignManager.selectCase';
			node: CaseTreeNode;
	  }>
	| Readonly<{
			kind: 'webview.createIssue.submittingIssue';
			value: boolean;
	  }>
	| Readonly<{
			kind: 'webview.createPR.setPullRequestSubmitting';
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
			kind: 'webview.fileExplorer.updateStagedJobs';
			value: JobHash[];
	  }>
	| Readonly<{
			kind: 'webview.fileExplorer.focusNode';
			id: string | null;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.setAutocompleteItems';
			autocompleteItems: string[];
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
			kind: 'webview.createPR.submitPR';
			value: CommitChangesFormData;
	  }>
	| Readonly<{
			kind: 'webview.createPR.commitChanges';
			value: CommitChangesFormData;
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
	| Omit<RunCodemodsCommand, 'title' | 'description'>
	| Readonly<{
			kind: 'webview.global.navigateToCommitView';
			jobHashes: JobHash[];
			diffId: string;
	  }>
	| Readonly<{
			kind: 'webview.global.applySelected';
			jobHashes: JobHash[];
			diffId: string;
	  }>
	| Readonly<{
			kind: 'webview.global.stageJobs';
			jobHashes: JobHash[];
	  }>
	| Readonly<{ kind: 'webview.global.showInformationMessage'; value: string }>
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
			id: string;
	  }>
	| Readonly<{
			kind: 'webview.fileExplorer.fileSelected';
			id: string;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.updatePathToExecute';
			value: {
				newPath: string;
				codemodHash: CodemodHash;
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
			kind: 'webview.codemods.setPublicCodemodsExpanded';
			publicCodemodsExpanded: boolean;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.haltCodemodExecution';
			value: CodemodHash;
	  }>
	| Readonly<{
			kind: 'webview.codemodList.codemodPathChange';
			codemodPath: string;
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
			viewId: 'treeView';
			viewProps: {
				caseHash: CaseHash;
				node: TreeNode;
				nodeIds: string[];
				fileNodes: FileTreeNode[] | null;
			} | null;
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
				nodes: CaseTreeNode[];
			} | null;
	  }>
	| Readonly<{
			viewId: 'jobDiffView';
			viewProps: {
				diffId: string;
				title: string;
				loading: boolean;
				showHooksCTA: boolean;
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
				publicCodemodsExpanded: boolean;
			};
	  }>;
