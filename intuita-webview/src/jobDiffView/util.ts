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

export function makeid(length: number) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
		counter += 1;
	}
	return result;
}
