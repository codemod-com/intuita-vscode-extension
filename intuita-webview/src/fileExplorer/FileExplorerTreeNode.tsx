import cn from 'classnames';

import { ReactComponent as CaseIcon } from '../assets/case.svg';
import TreeItem, { Props as TreeItemProps } from '../shared/TreeItem';

import { memo } from 'react';
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';

import styles from './style.module.css';

type Props = Omit<
	TreeItemProps,
	'icon' | 'startDecorator' | 'inlineStyles' | 'subLabel'
> & {
	iconName: IconName;
	checked: boolean;
	onCheckboxClick(e: React.MouseEvent): void;
};

export type IconName =
	| 'root'
	| 'folder'
	| 'folder-opened'
	| 'file-add'
	| 'file';

const Icon = ({ iconName }: { iconName: IconName }) => {
	if (iconName === 'root') {
		return <CaseIcon />;
	}

	return <span className={cn('codicon', `codicon-${iconName}`)} />;
};

const Checkbox = memo(
	({
		checked,
		onClick,
	}: {
		checked: boolean;
		onClick(e: React.MouseEvent): void;
	}) => {
		return (
			<VSCodeCheckbox
				onClick={onClick}
				checked={checked}
				className={styles.checkbox}
			/>
		);
	},
);

const FileExplorerTreeNode = ({
	hasChildren,
	id,
	label,
	depth,
	open,
	focused,
	iconName,
	checked,
	onClick,
	onCheckboxClick,
	onPressChevron,
}: Props) => {
	return (
		<TreeItem
			hasChildren={hasChildren}
			id={id}
			label={label}
			subLabel=""
			icon={<Icon iconName={iconName} />}
			depth={depth}
			open={open}
			focused={focused}
			onClick={onClick}
			startDecorator={
				<Checkbox checked={checked} onClick={onCheckboxClick} />
			}
			onPressChevron={onPressChevron}
			inlineStyles={{
				root: {
					...(!focused && {
						backgroundColor: 'var(--vscode-list-hoverBackground)',
					}),
					paddingRight: 4,
				},
			}}
		/>
	);
};

export default memo(FileExplorerTreeNode);
