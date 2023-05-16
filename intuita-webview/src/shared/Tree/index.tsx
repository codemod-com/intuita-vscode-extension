import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';
import { useKey } from '../../jobDiffView/hooks/useKey';
import { vscode } from '../utilities/vscode';

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
	}: {
		index: number;
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
	}): ReactNode;
	focusedNodeId: string | null;
};

const Tree = ({ node, focusedNodeId, depth, renderItem, index }: Props) => {
	const hasNoChildren = !node.children || node.children.length === 0;
	const [open, setIsOpen] = useState(true);
	const handleArrowKeyDown = (key: 'ArrowLeft' | 'ArrowRight') => {
		if (node.id !== focusedNodeId) {
			return;
		}

		if (key === 'ArrowRight' && hasNoChildren) {
			vscode.postMessage({
				kind: 'webview.global.focusView',
				webviewName: 'diffView',
				lastNodeId: node.id,
			});
			return;
		}

		setIsOpen(key === 'ArrowLeft' ? false : true);
	};

	useKey('ArrowLeft', () => {
		handleArrowKeyDown('ArrowLeft');
	});

	useKey('ArrowRight', () => {
		handleArrowKeyDown('ArrowRight');
	});

	const treeItem = renderItem({
		index,
		node,
		depth,
		open,
		setIsOpen,
	});

	if (hasNoChildren) {
		return <>{treeItem}</>;
	}

	return (
		<>
			<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
				{open
					? node.children.map((child, index) => (
							<Tree
								key={child.id}
								node={child}
								renderItem={renderItem}
								depth={depth + 1}
								index={index}
								focusedNodeId={focusedNodeId}
							/>
					  ))
					: null}
			</ReactTreeView>
		</>
	);
};

export default memo(Tree);
export type { TreeNode };
