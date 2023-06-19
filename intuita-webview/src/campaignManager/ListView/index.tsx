import { CaseTreeNode } from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import styles from './style.module.css';
import TreeItem from '../../shared/TreeItem';
import { CaseHash } from '../../../../src/cases/types';

type Props = {
	nodes: CaseTreeNode[];
	selectedCaseHash: CaseHash | null;
	onItemClick(node: CaseTreeNode): void;
};

const ListView = ({ nodes, selectedCaseHash, onItemClick }: Props) => {
	return (
		<div className={styles.container}>
			{nodes.map((node) => {
				return (
					<TreeItem
						key={node.id}
						hasChildren={node.children.length !== 0}
						id={node.id}
						label={node.label ?? ''}
						subLabel=""
						icon={<CaseIcon />}
						depth={0}
						open={false}
						focused={node.id === selectedCaseHash}
						actionButtons={null}
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
