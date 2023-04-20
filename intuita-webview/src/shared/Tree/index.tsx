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
		isLastChild,
	}: {
		index: number;
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
		color: string;
		isLastChild: boolean;
	}): ReactNode;
	color: string;
	isLastChild: boolean;
};

const Tree = ({
	node,
	depth,
	renderItem,
	color: colorProp,
	index,
	isLastChild,
}: Props) => {
	const hasNoChildren = !node.children || node.children.length === 0;
	const isFolderBreakdown = [
		'folderElement',
		'acceptedFolderElement',
	].includes(node.kind);
	const [open, setIsOpen] = useState(depth === 0);
	const [color] = useState(
		hasNoChildren ? colorProp : generateColor(buildHash(node.id)),
	);
	const treeItem = renderItem({
		index,
		isLastChild,
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

	const caseByFolderComponents = caseByFolderElements.map(
		(child, index, arr) => (
			<Tree
				key={child.id}
				node={child}
				renderItem={renderItem}
				depth={depth}
				color={color}
				index={index}
				isLastChild={arr.length - 1 === index}
			/>
		),
	);

	return (
		<>
			<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
				{open ? (
					<>
						{isFolderBreakdown && caseByFolderComponents}
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
								isLastChild={arr.length - 1 === index}
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
