import { FileSystem, StatusBarItem, Uri } from 'vscode';

export class NoraRustEngineService {
	protected buildArguments(
		uri: Uri,
		outputUri: Uri,
		group: 'nextJs' | 'mui',
	): readonly string[] {
		const pattern = Uri.joinPath(uri, '**/*.tsx').fsPath;

		return [
			'-d',
			uri.fsPath,
			'-p',
			`"${pattern}"`,
			'-a',
			'**/node_modules/**/*',
			'-g',
			group,
			'-o',
			outputUri.fsPath,
		];
	}
}
