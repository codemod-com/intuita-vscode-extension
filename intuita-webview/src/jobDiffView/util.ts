import { JobHash } from '../shared/types';
import { vscode } from '../shared/utilities/vscode';

export const reportIssue = (
	faultyJobHash: JobHash,
	oldFileContent: string,
	newFileContent: string,
) => {
	vscode.postMessage({
		kind: 'webview.global.reportIssue',
		faultyJobHash,
		oldFileContent,
		newFileContent,
	});
};
