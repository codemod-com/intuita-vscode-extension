export type Command = {
	title: string;
	command: string;
	arguments: any[];
};

export type TreeNode = {
	id: string;
	label?: string;
	iconName?: string;
	kind?: string;
	command?: Command;
	actions?: Command[];
	children?: TreeNode[];
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
	  }>;

export type WebviewResponse =
	| Readonly<{
			kind: 'webview.createIssue.submitIssue';
			value: {
				title: string;
				body: string;
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
				}>;
			};
	  }>
	| Readonly<{
			viewId: 'createPR';
			viewProps: {
				loading: boolean;
				error: string;
				baseBranchOptions: string[];
				targetBranchOptions: string[];
				initialFormData: Partial<{
					title: string;
					body: string;
					baseBranch: string;
					targetBranch: string;
				}>;
			};
	  }>
	| Readonly<{
			viewId: 'treeView';
			viewProps: {
				node: TreeNode;
			};
	  }>;
