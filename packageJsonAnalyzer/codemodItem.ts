import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import path from 'path';
import { buildCodemodItemHash } from './utils';
import { CodemodHash } from './types';

export class CodemodItem extends TreeItem {
	public readonly hash: CodemodHash;
	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly commandToExecute: string,
		public readonly pathToExecute: string,
	) {
		super(label, collapsibleState);
		this.description = description;
		this.tooltip = `${label}-${description}`;
		this.contextValue = 'codemodItem';
		this.commandToExecute = commandToExecute;
		this.pathToExecute = pathToExecute;
		this.hash = buildCodemodItemHash(this);
	}

	iconPath = path.join(
		__filename,
		'..',
		'..',
		'resources',
		'bluelightbulb.svg',
	);
}
