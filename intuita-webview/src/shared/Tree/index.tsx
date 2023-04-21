import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';
import { buildHash, generateColor } from '../../utilities';

type Props = {
	index: number;
	depth: number;
	node: TreeNode;
	renderItem({
		index,
		node,
		depth,
		open,
		setIsOpen,
		color,
		lastChild,
	}: {
		index: number;
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
		color: string;
		lastChild: boolean;
	}): ReactNode;
	color: string;
	lastChild: boolean;
};

const Tree = ({
	node,
	depth,
	renderItem,
	color: colorProp,
	index,
	lastChild,
}: Props) => {
	const hasNoChildren = !node.children || node.children.length === 0;
	const isFolderBreakdown = node.kind === 'folderElement';
	const [open, setIsOpen] = useState(depth === 0);
	const [color] = useState(
		hasNoChildren ? colorProp : generateColor(buildHash(node.id)),
	);
	const treeItem = renderItem({
		index,
		lastChild,
		color,
		node,
		depth,
		open,
		setIsOpen,
	});

	if (hasNoChildren) {
		return <>{treeItem}</>;
	}

	const folderElements: TreeNode[] = [];
	const caseByFolderElements: TreeNode[] = [];

	// separate folder children and caseByFolder children
	// since we want to display all caseByFolder children at the current depth
	// while we want to display all folder children at 1 level deeper depth
	if (isFolderBreakdown) {
		node.children.forEach((element) => {
			if (!element.kind) {
				return;
			}
			if (element.kind === 'folderElement') {
				folderElements.push(element);
			} else if (element.kind === 'caseByFolderElement') {
				caseByFolderElements.push(element);
			}
		});
	}

	const caseByFolderComponents = caseByFolderElements.map(
		(child, index, arr) => (
			<Tree
				key={child.id}
				node={child}
				renderItem={renderItem}
				depth={depth}
				color={color}
				index={index}
				lastChild={arr.length - 1 === index}
			/>
		),
	);

	return (
		<>
			<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
				{open ? (
					<>
						{isFolderBreakdown &&
							folderElements.length === 0 &&
							caseByFolderComponents}
						{(isFolderBreakdown
							? folderElements
							: node.children
						).map((child, index, arr) => (
							<Tree
								key={child.id}
								node={child}
								renderItem={renderItem}
								depth={depth + 1}
								color={color}
								index={index}
								lastChild={arr.length - 1 === index}
							/>
						))}
					</>
				) : null}
			</ReactTreeView>
			{!open && isFolderBreakdown && caseByFolderComponents}
		</>
	);
};

export default memo(Tree);
export type { TreeNode };
