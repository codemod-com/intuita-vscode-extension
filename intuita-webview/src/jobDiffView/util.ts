import { JobHash } from '../shared/types';
import { vscode } from '../shared/utilities/vscode';

export const reportIssue = (
	faultyJobHash: JobHash,
	oldFileContent: string,
	newFileContent: string,
) => {
	vscode.postMessage({
		kind: 'webview.global.openCreateIssue',
		faultyJobHash,
		oldFileContent,
		newFileContent,
	});
};

export const exportToCodemodStudio = (
	faultyJobHash: JobHash,
	oldFileContent: string,
	newFileContent: string,
) => {
	vscode.postMessage({
		kind: 'webview.global.exportToCodemodStudio',
		faultyJobHash,
		oldFileContent,
		newFileContent,
	});
};
