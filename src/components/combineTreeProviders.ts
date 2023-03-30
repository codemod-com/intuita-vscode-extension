import { ProviderResult, TreeItem } from 'vscode';
import { ElementHash } from '../elements/types';
import { IntuitaTreeDataProvider } from './intuitaTreeDataProvider';
import type { CaseManager } from '../cases/caseManager';
import { MessageBus, MessageKind } from './messageBus';
import { JobManager } from './jobManager';
import { CodemodService } from '../elements/CodemodList';

export class CombineTreeProviders extends IntuitaTreeDataProvider {
	readonly #codemodProvider: CodemodService;
	readonly #messageBus: MessageBus;
	public constructor(
		caseManager: CaseManager,
		messageBus: MessageBus,
		jobManager: JobManager,
		rootPath: string | null | undefined,
	) {
		super(caseManager, messageBus, jobManager);
		this.#codemodProvider = new CodemodService(rootPath);
		this.#messageBus = messageBus;
		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
			const codemodItemFound = this.#codemodProvider.getElement(
				message.codemodHash as ElementHash,
			);
			this.#codemodProvider.runCodemod(codemodItemFound.commandToExecute);
		});
	}

	public getChildren(
		elementHash?: ElementHash,
	): ProviderResult<ElementHash[]> {
		const treeChildren = super.getChildren(elementHash);
		const treeArray = Array.isArray(treeChildren) ? treeChildren : [];
		if (!treeChildren || !treeArray.length) {
			return this.#codemodProvider.getChildren();
		}
		return treeChildren;
	}

	public getTreeItem(
		elementHash: ElementHash,
	): TreeItem | Thenable<TreeItem> {
		const codemodItemFound = this.#codemodProvider.getElement(elementHash);
		if (codemodItemFound) {
			return codemodItemFound;
		}
		return super.getTreeItem(elementHash);
	}
}
