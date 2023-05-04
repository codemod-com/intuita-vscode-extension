import { CaseTreeNode } from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import TreeItem from '../../shared/TreeItem';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';

type Props = {
	nodes: CaseTreeNode[];
	selectedCaseNode: CaseTreeNode | null;
	setSelectedCaseNode: Dispatch<SetStateAction<CaseTreeNode | null>>;
};

const ListView = ({ nodes, selectedCaseNode, setSelectedCaseNode }: Props) => {
	const handleClick = useCallback((node: CaseTreeNode) => {
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
		if (selectedCaseNode === null) {
			return;
		}

		handleClick(selectedCaseNode);
	}, [handleClick, selectedCaseNode]);

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
						focused={
							selectedCaseNode !== null
								? node.id === selectedCaseNode.id
								: false
						}
						actionButtons={null}
						index={index}
						onClick={() => {
							setSelectedCaseNode(node);
							handleClick(node);
						}}
					/>
				);
			})}
		</div>
	);
};

export default ListView;
