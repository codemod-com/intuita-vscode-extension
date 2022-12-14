import { FileSystem, StatusBarItem, Uri } from 'vscode';
import { CaseKind } from '../cases/types';
import { MessageBus } from './messageBus';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { EngineService } from './engineService';

export class NoraNodeEngineService {
	protected buildArguments(
		uri: Uri,
		outputUri: Uri,
		group: 'nextJs' | 'mui',
	): readonly string[] {
		const pattern = Uri.joinPath(uri, '**/*.tsx').fsPath;

		return [
			'-p',
			pattern,
			'-p',
			'!**/node_modules',
			'-g',
			group,
			'-l',
			'100',
			'-o',
			outputUri.fsPath,
		];
	}
}
