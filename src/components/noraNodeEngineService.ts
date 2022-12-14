import { FileSystem, StatusBarItem, Uri } from 'vscode';
import { CaseKind } from '../cases/types';
import { MessageBus } from './messageBus';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { EngineService } from './engineService';

export class NoraNodeEngineService extends EngineService {
	readonly #downloadService: DownloadService;
	readonly #globalStorageUri: Uri;

	public constructor(
		downloadService: DownloadService,
		fileSystem: FileSystem,
		globalStorageUri: Uri,
		messageBus: MessageBus,
		statusBarItem: StatusBarItem,
	) {
		super(
			CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE,
			messageBus,
			fileSystem,
			statusBarItem,
			'noraNodeEngineOutput',
		);

		this.#downloadService = downloadService;
		this.#globalStorageUri = globalStorageUri;
	}

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
