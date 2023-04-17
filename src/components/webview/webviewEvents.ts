import { Command } from 'vscode';
import { JobHash, JobKind } from '../../jobs/types';
import { ElementHash } from '../../elements/types';
export type { Command } from 'vscode';

export type JobDiffViewProps = Readonly<{
	jobHash: JobHash;
	jobKind: JobKind;
	oldFileContent: string | null;
	newFileContent: string | null;
	oldFileTitle: string | null;
	newFileTitle: string | null;
	title: string | null;
}>;

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
			kind: 'webview.createIssue.setLoading';
			value: boolean;
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
			value: {
				title: string;
				body: string;
				baseBranch: string;
				targetBranch: string;
			};
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
			kind: 'webview.createPR.afterFormDataChanged';
			value: {
				baseBranch: string;
				targetBranch: string;
				title: string;
				body: string;
				remoteUrl: string;
			};
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
			};
	  }>
	| Readonly<{
			viewId: 'jobDiffView';
			viewProps: {
				data: JobDiffViewProps[];
			};
	  }>;
