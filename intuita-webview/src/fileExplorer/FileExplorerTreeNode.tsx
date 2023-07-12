import cn from 'classnames';
import TreeItem, { Props as TreeItemProps } from '../shared/TreeItem';
import { memo } from 'react';
import { ReactComponent as CheckboxMaterialIcon } from '../assets/material-icons/check_box.svg';
import { ReactComponent as CheckboxOutlineBlankMaterialIcon } from '../assets/material-icons/check_box_outline_blank.svg';
import { ReactComponent as IndeterminateCheckboxMaterialIcon } from '../assets/material-icons/indeterminate_check_box.svg';

import styles from './style.module.css';
import { _ExplorerNode } from '../../../src/persistedState/explorerNodeCodec';

type Props = Omit<
	TreeItemProps,
	'icon' | 'startDecorator' | 'inlineStyles' | 'subLabel'
> & {
	kind: _ExplorerNode['kind'];
	iconName: IconName | null;
	checkboxState: 'checked' | 'blank' | 'indeterminate';
	onCheckboxClick(e: React.MouseEvent): void;
};

export type IconName = 'file-add' | 'file';

const getIcon = (iconName: IconName | null) => {
	if (iconName !== 'file-add' && iconName !== 'file') {
		return null;
	}

	return <span className={cn('codicon', `codicon-${iconName}`)} />;
};

const getIndent = (kind: _ExplorerNode['kind'], depth: number) => {
	let offset = 17 * depth;

	if (kind === 'FILE') {
		offset += 17;
	}

	return offset;
};

const Checkbox = memo(
	({
		checkboxState,
		onClick,
	}: {
		checkboxState: 'checked' | 'blank' | 'indeterminate';
		onClick(e: React.MouseEvent): void;
	}) => {
		return (
			<span onClick={onClick} className={styles.checkbox}>
				{checkboxState === 'checked' && (
					<CheckboxMaterialIcon fill="var(--vscode-icon-foreground)" />
				)}
				{checkboxState === 'blank' && (
					<CheckboxOutlineBlankMaterialIcon fill="var(--vscode-icon-foreground)" />
				)}
				{checkboxState === 'indeterminate' && (
					<IndeterminateCheckboxMaterialIcon fill="var(--vscode-icon-foreground)" />
				)}
			</span>
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
	checkboxState,
	kind,
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
			icon={getIcon(iconName)}
			indent={getIndent(kind, depth)}
			depth={depth}
			open={open}
			focused={focused}
			onClick={onClick}
			startDecorator={
				<Checkbox
					checkboxState={checkboxState}
					onClick={onCheckboxClick}
				/>
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
