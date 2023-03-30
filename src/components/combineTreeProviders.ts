import { TreeItem } from 'vscode';
import { ElementHash } from '../elements/types';
import { IntuitaTreeDataProvider } from './intuitaTreeDataProvider';
import type { CaseManager } from '../cases/caseManager';
import { MessageBus, MessageKind } from './messageBus';
import { JobManager } from './jobManager';
import { CodemodItem, CodemodService } from '../elements/CodemodList';

export class CombineTreeProviders extends IntuitaTreeDataProvider {
	private codemodProvider: CodemodService;
	readonly #messageBus: MessageBus;
	public constructor(
		caseManager: CaseManager,
		messageBus: MessageBus,
		jobManager: JobManager,
		rootPath: string | null | undefined,
	) {
		super(caseManager, messageBus, jobManager);
		this.codemodProvider = new CodemodService(rootPath);
		this.#messageBus = messageBus;
		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
			const codemodItemFound = this.codemodProvider.getElement(
				message.codemodHash as ElementHash,
			);
			this.codemodProvider.runCodemod(codemodItemFound.commandToExecute);
		});
	}

	// TODO: update this by implementing the getChildren using hash
	public getChildren(elementHash?: ElementHash): ElementHash[] {
		if (elementHash && this.isCodemodItem(elementHash)) {
			return this.codemodProvider.getChildren();
		}
		const treeChildren = super.getChildren(elementHash);
		const treeArray = Array.isArray(treeChildren) ? treeChildren : [];
		if (!treeChildren || !treeArray.length) {
			return this.codemodProvider.getChildren();
		}
		return treeChildren;
	}

	public getTreeItem(
		elementHash: ElementHash,
	): TreeItem | Thenable<TreeItem> {
		const codemodItemFound = this.codemodProvider.getElement(elementHash);
		if (codemodItemFound) {
			return codemodItemFound;
		}
		return super.getTreeItem(elementHash);
	}

	private isCodemodItem(
		element: ElementHash | CodemodItem | undefined,
	): element is CodemodItem {
		return (
			element !== undefined &&
			typeof element !== 'string' &&
			'name' in element
		);
	}
}
