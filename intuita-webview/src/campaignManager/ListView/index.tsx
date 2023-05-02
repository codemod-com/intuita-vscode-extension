import { CaseTreeNode } from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import TreeItem from '../../shared/TreeItem';
import { useCallback, useEffect, useState } from 'react';

type Props = {
	nodes: CaseTreeNode[];
	selectedCaseNode: CaseTreeNode | null;
};

const ListView = ({ nodes, selectedCaseNode }: Props) => {
	const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

	const handleClick = useCallback((node: CaseTreeNode) => {
		setFocusedNodeId(node.id);

		vscode.postMessage({
			kind: 'webview.campaignManager.caseSelected',
			hash: node.id,
		});

		if (node.command) {
			vscode.postMessage({
				kind: 'webview.command',
				value: node.command,
			});
		}
	}, []);

	useEffect(() => {
		if (
			selectedCaseNode === null ||
			selectedCaseNode.id === focusedNodeId
		) {
			return;
		}

		handleClick(selectedCaseNode);
	}, [handleClick, focusedNodeId, selectedCaseNode]);

	return (
		<div className={styles.container}>
			{nodes.map((node, index) => {
				return (
					<TreeItem
						style={{
							...(node.caseApplied && {
								opacity: 0.5,
							}),
						}}
						key={node.id}
						hasChildren={(node.children?.length ?? 0) !== 0}
						id={node.id}
						label={node.label ?? ''}
						subLabel=""
						icon={<CaseIcon />}
						depth={0}
						kind={node.kind}
						open={false}
						focused={node.id === focusedNodeId}
						actionButtons={null}
						index={index}
						onClick={() => {
							handleClick(node);
						}}
					/>
				);
			})}
		</div>
	);
};

export default ListView;
