import {
	CaseTreeNode,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import TreeItem from '../../shared/TreeItem';
import { useCallback, useState } from 'react';

type Props = {
	nodes: CaseTreeNode[];
};

const ListView = ({ nodes }: Props) => {
	const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

	const handleClick = useCallback((node: TreeNode) => {
		if (!node.command) {
			return;
		}
		vscode.postMessage({
			kind: 'webview.command',
			value: node.command,
		});
	}, []);

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
							setFocusedNodeId(node.id);
							vscode.postMessage({
								kind: 'webview.campaignManager.caseSelected',
								hash: node.id,
							});
						}}
					/>
				);
			})}
		</div>
	);
};

export default ListView;
