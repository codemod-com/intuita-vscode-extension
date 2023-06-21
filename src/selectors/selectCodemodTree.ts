import path from 'path';
import { CodemodEntry } from '../codemods/types';
import { buildHash } from '../utilities';
import { RootState } from '../data';

export type CodemodNodeHashDigest = string & {
	__CodemodNodeHashDigest: 'CodemodNodeHashDigest';
};

export const buildRootNode = () =>
	({
		hashDigest: buildHash('ROOT') as CodemodNodeHashDigest,
		kind: 'ROOT' as const,
		label: '',
	} as const);

export const buildDirectoryNode = (name: string) =>
	({
		hashDigest: buildHash(name) as CodemodNodeHashDigest,
		kind: 'DIRECTORY' as const,
		label: name,
	} as const);

export const buildCodemodNode = (codemod: CodemodEntry, name: string) => {
	return {
		kind: 'CODEMOD' as const,
		hashDigest: codemod.hashDigest as CodemodNodeHashDigest,
		label: name,
	} as const;
};

export type CodemodNode =
	| ReturnType<typeof buildRootNode>
	| ReturnType<typeof buildDirectoryNode>
	| ReturnType<typeof buildCodemodNode>;

export const selectCodemodTree = (state: RootState) => {
	const codemods = Object.values(state.codemod.entities) as CodemodEntry[];

	const nodes: Record<CodemodNodeHashDigest, CodemodNode> = {};
	const children: Record<CodemodNodeHashDigest, CodemodNodeHashDigest[]> = {};

	const parents: Record<CodemodNodeHashDigest, CodemodNodeHashDigest> = {};
	const pathsMap = new Map<string, CodemodNode>();

	const rootNode = buildRootNode();
	nodes[rootNode.hashDigest] = rootNode;
	children[rootNode.hashDigest] = [];

	codemods.forEach((codemod) => {
		const { name } = codemod;

		const pathParts = name.split(path.sep).filter((part) => part !== '');

		if (pathParts.length === 0) {
			return;
		}

		let currNode: CodemodNode | null = null;

		pathParts.forEach((part, idx) => {
			const dirName = pathParts.slice(0, idx + 1).join('/');

			if (pathsMap.has(dirName)) {
				return;
			}

			const parentDirName = pathParts.slice(0, idx).join('/');

			if (idx === pathParts.length - 1) {
				currNode = buildCodemodNode(codemod, part);
			} else {
				currNode = buildDirectoryNode(dirName);
			}

			pathsMap.set(dirName, currNode);
			nodes[currNode.hashDigest] = currNode;

			const parentNode = pathsMap.get(parentDirName) ?? null;

			if (parentNode === null) {
				return;
			}

			parents[currNode.hashDigest] = parentNode.hashDigest;

			if (children[parentNode.hashDigest] === undefined) {
				children[parentNode.hashDigest] = [];
			}

			children[parentNode.hashDigest]?.push(currNode.hashDigest);
		});
	});

	return {
		rootNodeHashDigest: rootNode.hashDigest,
		nodes,
		children,
		parents,
		selectedNodeHashDigest: null,
		expandedNodeHashDigests: [],
	};
};
