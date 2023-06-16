import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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
import { useKey } from '../../jobDiffView/hooks/useKey';

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
	onDoubleClick(): void;
	depth: number;
	disabled: boolean;
	rootPath: string;
	executionPath?: T.These<SyntheticError, string>;
	autocompleteItems: string[];
	collapse(): void;
	expand(): void;
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
	onDoubleClick,
	depth,
	executionPath,
	autocompleteItems,
	collapse,
	expand,
}: Props) => {
	const ref = useRef<HTMLDivElement>(null);
	const repoName = rootPath.split('/').slice(-1)[0] ?? '';
	const [editingPath, setEditingPath] = useState(false);

	useEffect(() => {
		if (!focused) {
			return;
		}

		const timeout = setTimeout(() => {
			ref.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}, 500);

		return () => {
			clearTimeout(timeout);
		};
	}, [focused]);

	const handleEnterKeyDown = () => {
		if (!focused || hasChildren) {
			return;
		}

		onDoubleClick();
	};

	useKey(
		document.getElementById('codemodDiscoveryView-treeContainer'),
		'Enter',
		handleEnterKeyDown,
	);

	const handleArrowKeyDown = (key: 'ArrowLeft' | 'ArrowRight') => {
		if (!focused || !hasChildren) {
			return;
		}

		if (key === 'ArrowLeft') {
			collapse();
		} else {
			expand();
		}
	};

	useKey(
		document.getElementById('codemodDiscoveryView-treeContainer'),
		'ArrowLeft',
		() => {
			handleArrowKeyDown('ArrowLeft');
		},
	);
	useKey(
		document.getElementById('codemodDiscoveryView-treeContainer'),
		'ArrowRight',
		() => {
			handleArrowKeyDown('ArrowRight');
		},
	);

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
			ref={ref}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
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
				<span className={styles.labelContainer}>
					<Popover
						trigger={
							<span
								style={{
									...(editingPath && {
										display: 'none',
									}),
									userSelect: 'none',
								}}
								className={cn(
									kind === 'codemodItem' &&
										styles.codemodItemLabel,
								)}
							>
								{label}
							</span>
						}
						popoverText="Double-click to open the documentation."
						disabled={editingPath || kind === 'path'}
					/>
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
								error={
									error === null ? null : { message: error }
								}
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
				<div
					className={cn(
						styles.actions,
						kind === 'codemodItem' && styles.codemodItemActions,
					)}
				>
					{actionButtons.map((el) => el)}
				</div>
			)}
		</div>
	);
};

export default TreeItem;
