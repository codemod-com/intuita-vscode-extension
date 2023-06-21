import path from 'path';
import { CodemodEntry } from '../codemods/types';
import { buildHash, capitalize } from '../utilities';
import { RootState } from '../data';

export type CodemodNodeHashDigest = string & {
	__CodemodNodeHashDigest: 'CodemodNodeHashDigest';
};

export type NodeDatum = Readonly<{
	node: CodemodNode;
	depth: number;
	expanded: boolean;
	focused: boolean;
	childCount: number;
}>;

const buildCodemodTitle = (name: string): string => {
	return name
		.split('-')
		.map((word) => capitalize(word))
		.join(' ');
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
		label: buildCodemodTitle(name),
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
	const nodePathMap = new Map<string, CodemodNode>();

	const rootNode = buildRootNode();
	nodes[rootNode.hashDigest] = rootNode;
	children[rootNode.hashDigest] = [];

	codemods.forEach((codemod) => {
		const { name } = codemod;

		const pathParts = name.split(path.sep).filter((part) => part !== '');

		if (pathParts.length === 0) {
			return;
		}

		pathParts.forEach((part, idx) => {
			let currNode: CodemodNode | null = null;
			const codemodDirName = pathParts.slice(0, idx + 1).join('/');

			if (nodePathMap.has(codemodDirName)) {
				return;
			}

			const parentDirName = pathParts.slice(0, idx).join('/');

			if (idx === pathParts.length - 1) {
				currNode = buildCodemodNode(codemod, part);
			} else {
				currNode = buildDirectoryNode(codemodDirName);
			}

			nodePathMap.set(codemodDirName, currNode);
			nodes[currNode.hashDigest] = currNode;

			const parentNode =
				idx === 0 ? rootNode : nodePathMap.get(parentDirName) ?? null;

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

	const nodeData: NodeDatum[] = [];

	const appendNodeData = (
		hashDigest: CodemodNodeHashDigest,
		depth: number,
	) => {
		const node = nodes[hashDigest] ?? null;

		if (node === null) {
			return;
		}

		const expanded =
			state.codemodDiscoveryView.openedCodemodHashDigests.includes(
				hashDigest,
			);
		const focused =
			state.codemodDiscoveryView.focusedCodemodHashDigest === hashDigest;
		const childSet = children[node.hashDigest] ?? [];

		if (depth !== -1) {
			nodeData.push({
				node,
				depth,
				expanded,
				focused,
				childCount: childSet.length,
			});
		}

		if (!expanded && depth !== -1) {
			return;
		}

		for (const child of childSet) {
			appendNodeData(child, depth + 1);
		}
	};

	appendNodeData(rootNode.hashDigest, -1);

	return {
		nodeData,
		selectedNodeHashDigest: state.codemodDiscoveryView
			.focusedCodemodHashDigest as CodemodNodeHashDigest | null,
		expandedNodeHashDigests: state.codemodDiscoveryView
			.openedCodemodHashDigests as CodemodNodeHashDigest[],
	};
};

export const selectExecutionPaths = (state: RootState) => {
	return state.codemodDiscoveryView.executionPaths;
};
