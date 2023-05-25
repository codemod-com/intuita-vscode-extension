import { ReactNode, useCallback, useState } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import { CodemodHash, CodemodTreeNode } from '../../shared/types';
import Popover from '../../shared/Popover';
import { DirectorySelector } from '../components/DirectorySelector';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';
import { SyntheticError } from '../../../../src/errors/types';
import debounce from '../../shared/utilities/debounce';
import { vscode } from '../../shared/utilities/vscode';

type Props = {
	id: CodemodHash;
	progressBar: JSX.Element | null;
	label: string;
	description: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	actionButtons: ReactNode[];
	hasChildren: boolean;
	kind: CodemodTreeNode['kind'];
	onClick(): void;
	depth: number;
	disabled: boolean;
	rootPath: string;
	executionPath?: T.These<SyntheticError, string>;
	autocompleteItems: string[];
};

const handleCodemodPathChange = debounce((rawCodemodPath: string) => {
	const codemodPath = rawCodemodPath.trim();

	vscode.postMessage({
		kind: 'webview.codemodList.codemodPathChange',
		codemodPath,
	});
}, 50);

const TreeItem = ({
	id,
	label,
	progressBar,
	description,
	kind,
	icon,
	open,
	focused,
	rootPath,
	actionButtons,
	hasChildren,
	onClick,
	depth,
	executionPath,
	autocompleteItems
}: Props) => {
	const repoName = rootPath.split('/').slice(-1)[0] ?? '';
	const [editingPath, setEditingPath] = useState(false);

	const error: string | null = pipe(
		O.fromNullable(executionPath),
		O.fold(
			() => null,
			T.fold(
				({ message }) => message,
				() => null,
				({ message }) => message,
			),
		),
	);

	const path: string = pipe(
		O.fromNullable(executionPath),
		O.fold(
			() => '',
			T.fold(
				() => '',
				(p) => p,
				(_, p) => p,
			),
		),
	);

	const targetPath =
		path.replace(rootPath, '').length === 0
			? `${repoName}/`
			: path.replace(rootPath, repoName);

	const onEditStart = useCallback(() => {
		setEditingPath(true);
	}, []);

	const onEditEnd = useCallback(() => {
		setEditingPath(false);
	}, []);

	const onEditCancel = useCallback(() => {
		setEditingPath(false);
	}, []);

	
	return (
		<div
			id={id}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
		>
			<div
				style={{
					// root folder, which we hide, has depth={0}
					// framework/library folders have depth={1}
					...(depth === 1 && {
						minWidth: '0.25rem',
					}),
					...(depth > 1 && {
						minWidth: `${5 + depth * 16}px`,
					}),
				}}
			/>
			{!editingPath && (
				<>
					{hasChildren ? (
						<div className={styles.codicon}>
							<span
								className={cn('codicon', {
									'codicon-chevron-right': !open,
									'codicon-chevron-down': open,
								})}
							/>
						</div>
					) : null}
					{kind === 'codemodItem' && description && (
						<Popover
							trigger={<div className={styles.icon}>{icon}</div>}
							position={['bottom left', 'top left']}
							mouseEnterDelay={300}
							popoverText={description}
						/>
					)}
					{(kind === 'path' || !description) && (
						<div className={styles.icon}>{icon}</div>
					)}
				</>
			)}
			<div className="flex w-full flex-col">
				<span className={styles.label}>
					{!editingPath && <span>{label}</span>}
					<span
						className={styles.directorySelector}
						style={{
							...(editingPath && {
								display: 'flex',
							}),
						}}
					>
						{kind === 'codemodItem' && executionPath && (
							<DirectorySelector
								defaultValue={targetPath}
								rootPath={rootPath}
								error={error}
								codemodHash={id}
								onEditStart={onEditStart}
								onEditEnd={onEditEnd}
								onEditCancel={onEditCancel}
								onChange={handleCodemodPathChange}
								autocompleteItems={autocompleteItems}
							/>
						)}
					</span>
				</span>

				{progressBar}
			</div>
			{!editingPath && (
				<div className={styles.actions}>
					{actionButtons.map((el) => el)}
				</div>
			)}
		</div>
	);
};

export default TreeItem;
