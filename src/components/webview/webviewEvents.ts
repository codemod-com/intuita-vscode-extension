import { Command } from 'vscode';
import { JobHash, JobKind } from '../../jobs/types';
import { ElementHash } from '../../elements/types';
export type { Command } from 'vscode';
import * as E from 'fp-ts/Either';

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
	actions?: JobAction[];
}>;

type CommitChangesFormData = {
	baseBranch: string;
	targetBranch: string;
	title: string;
	body: string;
	remoteUrl: string;
	commitMessage: string;
	createNewBranch: boolean;
	createPullRequest: boolean;
	stagedJobs: { hash: string; label: string }[];
};

export type CodemodTreeNode<T = undefined> = {
	id: string;
	kind: string;
	label: string;
	description?: string;
	iconName?: string;
	command?:
		| (Command & {
				command: 'intuita.openJobDiff';
				arguments?: JobHash[];
		  })
		| (Command & {
				command: 'intuita.openCaseDiff';
				arguments?: ElementHash[];
		  })
		| (Command & {
				command: 'intuita.openCaseByFolderDiff';
				arguments?: JobHash[];
		  })
		| (Command & {
				command: 'intuita.openFolderDiff';
				arguments?: JobHash[];
		  });
	actions?: Command[];
	children: CodemodTreeNode<T>[];
	extraData?: T;
};
export type TreeNode = {
	id: string;
	kind: string;
	label?: string;
	iconName?: string;
	command?:
		| (Command & {
				command: 'intuita.openJobDiff';
				arguments?: JobHash[];
		  })
		| (Command & {
				command: 'intuita.openCaseDiff';
				arguments?: ElementHash[];
		  })
		| (Command & {
				command: 'intuita.openCaseByFolderDiff';
				arguments?: JobHash[];
		  })
		| (Command & {
				command: 'intuita.openFolderDiff';
				arguments?: JobHash[];
		  });
	actions?: Command[];
	children: TreeNode[];
};
export type WebviewMessage =
	| Readonly<{
			kind: 'webview.createIssue.setFormData';
			value: Partial<{
				title: string;
				description: string;
			}>;
	  }>
	| Readonly<{
			kind: 'webview.global.setUserAccount';
			value: string | null;
	  }>
	| Readonly<{
			kind: 'webview.global.setRepositoryPath';
			repositoryPath: string | null;
	  }>
	| Readonly<{
			kind: 'webview.global.setView';
			value: View;
	  }>
	| Readonly<{
			kind: 'webview.diffView.updateDiffViewProps';
			data: JobDiffViewProps;
	  }>
	| Readonly<{
			kind: 'webview.diffview.rejectedJob';
			data: [JobHash];
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
			kind: 'webview.codemods.setPublicCodemods';
			data: E.Either<Error, CodemodTreeNode<string> | null>;
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
			kind: 'webview.tree.clearOutputFiles';
	  }>
	| Readonly<{
			kind: 'webview.global.requestFeature';
	  }>
	| Readonly<{
			kind: 'webview.global.openYouTubeChannel';
	  }>
	| Readonly<{
			kind: 'webview.command';
			value: Command;
	  }>
	| Readonly<{
			kind: 'webview.createPR.formDataChanged';
			value: {
				baseBranch: string;
				targetBranch: string;
				title: string;
				body: string;
				remoteUrl: string;
			};
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
			viewId: 'upsertPullRequest';
			viewProps: {
				loading: boolean;
				error: string;
				baseBranchOptions: string[];
				targetBranchOptions: string[];
				remoteOptions: string[];
				initialFormData: Partial<{
					title: string;
					body: string;
					baseBranch: string;
					targetBranch: string;
					remoteUrl: string;
				}>;
				pullRequestAlreadyExists: boolean;
			};
	  }>
	| Readonly<{
			viewId: 'treeView';
			viewProps: {
				node: TreeNode;
				fileNodes: TreeNode[];
			};
	  }>
	| Readonly<{
			viewId: 'jobDiffView';
			viewProps: {
				data: JobDiffViewProps[];
			};
	  }>
	| Readonly<{
			viewId: 'commitView';
			viewProps: {
				loading: boolean;
				error: string;
				baseBranchOptions: string[];
				targetBranchOptions: string[];
				remoteOptions: string[];
				initialFormData: Partial<CommitChangesFormData>;
			};
	  }>
	| Readonly<{
			viewId: 'codemodList';
			viewProps: {
				data?: CodemodTreeNode<string>;
			};
	  }>;
