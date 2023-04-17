import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';

type Props = {
	depth: number;
	node: TreeNode;
	renderItem({
		node,
		depth,
		open,
		setIsOpen,
	}: {
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
	}): ReactNode;
};

const Tree = ({ node, depth = 0, renderItem }: Props) => {
	const [open, setIsOpen] = useState(depth === 0);

	const treeItem = renderItem({ node, depth, open, setIsOpen });

	if (!node.children || node.children.length === 0) {
		return <>{treeItem}</>;
	}

	const folderElements: TreeNode[] = [];
	const caseByFolderElements: TreeNode[] = [];

	// separate folder elements and caseByFolder elements
	// since we want to display all caseByFolder elements above folder elements
	if (
		node.kind &&
		['folderElement', 'acceptedFolderElement'].includes(node.kind)
	) {
		node.children.forEach((element) => {
			if (!element.kind) {
				return;
			}
			if (
				['folderElement', 'acceptedFolderElement'].includes(
					element.kind,
				)
			) {
				folderElements.push(element);
			} else if (
				['caseByFolderElement', 'acceptedCaseByFolderElement'].includes(
					element.kind,
				)
			) {
				caseByFolderElements.push(element);
			}
		});
	}

	return (
		<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
			{open
				? (folderElements.length > 0 || caseByFolderElements.length > 0
						? caseByFolderElements.concat(folderElements)
						: node.children
				  ).map((child) => {
						return (
							<Tree
								key={child.id}
								node={child}
								renderItem={renderItem}
								depth={depth + 1}
							/>
						);
				  })
				: null}
		</ReactTreeView>
	);
};

export default memo(Tree);
export type { TreeNode };
