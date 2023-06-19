import TreeView, { INode, INodeRendererProps } from 'react-accessible-treeview';

type TreeNode<HD extends string> = Readonly<{
	hashDigest: HD;
	label: string;
}>;

export type TreeViewProps<HD extends string> = Readonly<{
	rootNodeHashDigest: HD;
	nodes: Record<HD, TreeNode<HD>>;
	children: Record<HD, ReadonlyArray<HD>>;
	parents: Record<HD, HD>;
	selectedNodeHashDigest: HD | null;
	expandedNodeHashDigests: ReadonlyArray<HD>;
	nodeRenderer: (props: INodeRendererProps) => React.ReactNode;
	onExpand: (hashDigest: HD) => void;
	onSelect: (hashDigest: HD) => void;
}>;

const buildData = <HD extends string>(
	props: TreeViewProps<HD>,
): ReadonlyArray<INode> => {
	const nodes: INode[] = [];

	const pushNode = (hashDigest: HD) => {
		const node = props.nodes[hashDigest] ?? null;

		if (node === null) {
			return;
		}

		const children = props.children[hashDigest]?.slice() ?? [];

		nodes.push({
			id: node.hashDigest,
			children,
			name: node.label,
			parent: props.parents[node.hashDigest] ?? null,
		});

		for (const childHashDigest of children) {
			pushNode(childHashDigest);
		}
	};

	pushNode(props.rootNodeHashDigest);

	return nodes;
};

export const IntuitaTreeView = <HD extends string>(
	props: TreeViewProps<HD>,
) => {
	const data = buildData(props).slice();

	const expandedIds = props.expandedNodeHashDigests.slice();

	const selectedIds = props.selectedNodeHashDigest
		? [props.selectedNodeHashDigest]
		: [];

	return (
		<TreeView
			data={data}
			nodeRenderer={props.nodeRenderer}
			expandedIds={expandedIds}
			selectedIds={selectedIds}
			onExpand={({ element }) => {
				props.onExpand(element.id as HD);
			}}
			onSelect={({ element }) => {
				props.onSelect(element.id as HD);
			}}
		/>
	);
};
