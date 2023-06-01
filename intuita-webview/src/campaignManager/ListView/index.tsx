import { CaseTreeNode } from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import styles from './style.module.css';
import TreeItem from '../../shared/TreeItem';

type Props = {
	nodes: CaseTreeNode[];
	selectedCaseNode: CaseTreeNode | null;
	onItemClick(node: CaseTreeNode): void;
};

const ListView = ({ nodes, selectedCaseNode, onItemClick }: Props) => {
	return (
		<div className={styles.container}>
			{nodes.map((node, index) => {
				return (
					<TreeItem
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
							onItemClick(node);
						}}
					/>
				);
			})}
		</div>
	);
};

export default ListView;
