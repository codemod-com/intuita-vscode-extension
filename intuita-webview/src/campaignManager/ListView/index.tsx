import {
	Command,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import TreeItem from '../../shared/TreeItem';

type Props = {
	node: TreeNode;
};

const TreeView = ({ node }: Props) => {
	const handleActionButtonClick = (action: Command) => {
		vscode.postMessage({ kind: 'webview.command', value: action });
	};

	const actionButtons = (node.actions ?? []).map((action) => (
		// eslint-disable-next-line jsx-a11y/anchor-is-valid
		<a
			title={action.title}
			role="button"
			onClick={(e) => {
				e.stopPropagation();
				handleActionButtonClick(action);
			}}
		>
			{action.title}
		</a>
	));

	return (
		<div className={styles.container}>
			<TreeItem
				disabled={false}
				hasChildren={(node.children?.length ?? 0) !== 0}
				id={node.id}
				label={node.label ?? ''}
				subLabel=""
				icon={<CaseIcon />}
				depth={0}
				kind={node.kind}
				open={false}
				focused={false}
				actionButtons={actionButtons}
				index={0}
				onClick={() => {}}
			/>
		</div>
	);
};

export default TreeView;
