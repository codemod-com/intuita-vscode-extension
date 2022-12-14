import { FileSystem, StatusBarItem, Uri } from 'vscode';
import { CaseKind } from '../cases/types';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { MessageBus } from './messageBus';
import { EngineService } from './engineService';

export class NoraRustEngineService extends EngineService {
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
			'noraRustEngineOutput',
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
