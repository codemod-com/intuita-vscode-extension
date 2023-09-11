import { CodemodEntry, PrivateCodemodEntry } from '../codemods/types';
import { buildHash, capitalize, isNeitherNullNorUndefined } from '../utilities';
import { RootState } from '../data';
import * as t from 'io-ts';
import * as T from 'fp-ts/These';
import { CodemodHash } from '../packageJsonAnalyzer/types';

const IntuitaCertifiedCodemods = [
	'next/13/app-directory-boilerplate',
	'next/13/built-in-next-font',
	'next/13/comment-deletable-files',
	'next/13/move-css-in-js-styles',
	'next/13/new-image-experimental',
	'next/13/new-link',
	'next/13/next-image-to-legacy-image',
	'next/13/remove-get-static-props',
	'next/13/remove-next-export',
	'next/13/replace-next-head',
	'next/13/replace-next-head-v2',
	'next/13/replace-next-router',
	'next/13/upsert-use-client-directive',
	'next/13/replace-next-head-repomod',
	'next/13/app-router',
	'next/13/app-router-recipe',
	'next/13/replace-api-routes',
];

interface CodemodNodeHashDigestBrand {
	readonly __CodemodNodeHashDigest: unique symbol;
}

export const codemodNodeHashDigestCodec = t.brand(
	t.string,
	(hashDigest): hashDigest is t.Branded<string, CodemodNodeHashDigestBrand> =>
		hashDigest.length > 0,
	'__CodemodNodeHashDigest',
);

export type CodemodNodeHashDigest = t.TypeOf<typeof codemodNodeHashDigestCodec>;

export type NodeDatum = Readonly<{
	node: CodemodNode;
	depth: number;
	expanded: boolean;
	focused: boolean;
	collapsable: boolean;
	reviewed: boolean;
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

export const buildDirectoryNode = (name: string, path: string) =>
({
	hashDigest: buildHash([path, name].join('_')) as CodemodNodeHashDigest,
	kind: 'DIRECTORY' as const,
	label: name,
} as const);

export const buildCodemodNode = (
	codemod: CodemodEntry | PrivateCodemodEntry,
	name: string,
	executionPath: string,
	queued: boolean,
	isPrivate: boolean,
) => {
	return {
		kind: 'CODEMOD' as const,
		name: codemod.name,
		isPrivate,
		hashDigest: codemod.hashDigest as CodemodNodeHashDigest,
		label: buildCodemodTitle(name),
		executionPath: T.right(executionPath),
		queued: queued,
		icon: isPrivate
			? 'private'
			: IntuitaCertifiedCodemods.includes(codemod.name)
				? 'certified'
				: 'community',
		permalink: isPrivate
			? (codemod as PrivateCodemodEntry).permalink
			: null,
	} as const;
};

export type CodemodNode =
	| ReturnType<typeof buildRootNode>
	| ReturnType<typeof buildDirectoryNode>
	| ReturnType<typeof buildCodemodNode>;

export const selectPrivateCodemods = (
	state: RootState,
	rootPath: string | null,
	executionQueue: ReadonlyArray<CodemodHash>,
) => {
	const codemods = Object.values(
		state.privateCodemods.entities,
	) as PrivateCodemodEntry[];

	const nodeData: NodeDatum[] = codemods.map((codemod) => {
		const { name, hashDigest } = codemod;
		const { executionPaths } = state.codemodDiscoveryView;

		const executionPath =
			executionPaths[codemod.hashDigest] ?? rootPath ?? '/';
		const node = buildCodemodNode(
			codemod,
			name,
			executionPath,
			executionQueue.includes(codemod.hashDigest as CodemodHash),
			true,
		);

		return {
			node,
			depth: 0,
			expanded: false,
			focused:
				state.codemodDiscoveryView.focusedCodemodHashDigest ===
				hashDigest,
			collapsable: false,
			reviewed: false,
		};
	});

	return {
		nodeData,
		focusedNodeHashDigest:
			state.codemodDiscoveryView.focusedCodemodHashDigest,
		collapsedNodeHashDigests: [],
	};
};

export const selectCodemodTree = (
	state: RootState,
	rootPath: string | null,
	executionQueue: ReadonlyArray<CodemodHash>,
) => {
	const codemods = Object.values(state.codemod.entities) as CodemodEntry[];
	codemods.sort((a, b) => a.name.localeCompare(b.name));
	const { executionPaths, searchPhrase } = state.codemodDiscoveryView;

	const nodes: Record<CodemodNodeHashDigest, CodemodNode> = {};
	const children: Record<CodemodNodeHashDigest, CodemodNodeHashDigest[]> = {};

	const nodePathMap = new Map<string, CodemodNode>();

	const rootNode = buildRootNode();
	nodes[rootNode.hashDigest] = rootNode;
	children[rootNode.hashDigest] = [];
	codemods.forEach((codemod) => {
		const { name } = codemod;

		const codemodTitle = buildCodemodTitle(name);

		if (
			!codemodTitle
				.trim()
				.toLocaleLowerCase()
				.includes(searchPhrase.trim().toLocaleLowerCase())
		) {
			return;
		}

		const sep = name.indexOf('/') !== -1 ? '/' : ':';

		const pathParts = name.split(sep).filter((part) => part !== '');

		if (pathParts.length === 0) {
			return;
		}

		pathParts.forEach((part, idx) => {
			let currNode: CodemodNode | null = null;
			const codemodDirName = pathParts.slice(0, idx + 1).join(sep);

			if (nodePathMap.has(codemodDirName)) {
				return;
			}

			const parentDirName = pathParts.slice(0, idx).join(sep);

			if (idx === pathParts.length - 1) {
				const executionPath =
					executionPaths[codemod.hashDigest] ?? rootPath ?? '/';
				currNode = buildCodemodNode(
					codemod,
					part,
					executionPath,
					executionQueue.includes(codemod.hashDigest as CodemodHash),
					false,
				);
			} else {
				currNode = buildDirectoryNode(part, codemodDirName);
			}

			nodePathMap.set(codemodDirName, currNode);
			nodes[currNode.hashDigest] = currNode;

			const parentNode =
				idx === 0 ? rootNode : nodePathMap.get(parentDirName) ?? null;

			if (parentNode === null) {
				return;
			}

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

		const isSearching = searchPhrase.trim().length !== 0;

		// searched nodes should always be expanded
		const expanded =
			isSearching ||
			state.codemodDiscoveryView.expandedNodeHashDigests.includes(
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
				collapsable: childSet.length !== 0,
				reviewed: false,
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

	const collapsedNodeHashDigests = Object.values(nodes)
		.map((node) => node.hashDigest)
		.filter(
			(hashDigest) =>
				!state.codemodDiscoveryView.expandedNodeHashDigests.includes(
					hashDigest,
				),
		);

	return {
		nodeData,
		focusedNodeHashDigest:
			state.codemodDiscoveryView.focusedCodemodHashDigest,
		collapsedNodeHashDigests,
	};
};

export const selectExecutionPaths = (state: RootState) => {
	return state.codemodDiscoveryView.executionPaths;
};

export const selectCodemodArguments = (state: RootState) => {
	const hashDigest =
		state.codemodDiscoveryView.codemodArgumentsPopupHashDigest;

	if (hashDigest === null) {
		return [];
	}

	const args =
		Object.values(state.codemod.entities)
			.filter(isNeitherNullNorUndefined)
			.find((codemodEntry) => codemodEntry.hashDigest === hashDigest)
			?.arguments ?? [];

	const savedArgsValues =
		state.codemodDiscoveryView.codemodArguments[hashDigest] ?? null;

	return args.map(({ name, default: defaultValue, ...rest }) => ({
		...rest,
		name,
		value: savedArgsValues?.[name] ?? String(defaultValue) ?? '',
	}));

	// @TODO remove `state.codemodDiscoveryView.executionPaths` state. Execution path should be a part of codemodArguments
};

export const selectCodemodArgumentsAsArray = (state: RootState) => selectCodemodArguments(state)
	.map(({ name, value }) => ({ name, value }));

export type CodemodTree = NonNullable<ReturnType<typeof selectCodemodTree>>;
