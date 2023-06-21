import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import Popover from '../shared/Popover';
import { DirectorySelector } from './components/DirectorySelector';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';
import { SyntheticError } from '../../../src/errors/types';
import debounce from '../shared/utilities/debounce';
import { vscode } from '../shared/utilities/vscode';
import {
	CodemodNodeHashDigest,
	CodemodNode,
} from '../../../src/selectors/selectCodemodTree';
import { NodeDatum } from '../intuitaTreeView';

import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';

const buildTargetPath = (path: string, rootPath: string, repoName: string) => {
	return path.replace(rootPath, '').length === 0
		? `${repoName}/`
		: path.replace(rootPath, repoName);
};

const getIcon = (
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>,
): ReactNode => {
	if (nodeDatum.node.kind === 'CODEMOD') {
		return <CaseIcon />;
	}

	if (nodeDatum.node.kind === 'DIRECTORY') {
		return (
			<span
				className={cn(
					'codicon',
					!nodeDatum.expanded
						? 'codicon-folder'
						: 'codicon-folder-opened',
				)}
			/>
		);
	}

	return <BlueLightBulbIcon />;
};

const handleCodemodPathChange = debounce((rawCodemodPath: string) => {
	const codemodPath = rawCodemodPath.trim();

	vscode.postMessage({
		kind: 'webview.codemodList.codemodPathChange',
		codemodPath,
	});
}, 50);

type Deps = {
	rootPath: string;
	progressBar: JSX.Element | null;
	description: string;
	actionButtons: ReactNode[];
	executionPath?: T.These<SyntheticError, string>;
	autocompleteItems: string[];
	pathDisplayValue: string | null;
	onDoubleClick(): void;
	onClick(): void;
};

type Props = Readonly<{
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>;
	onFlip: (hashDigest: CodemodNodeHashDigest) => void;
	onFocus: (hashDigest: CodemodNodeHashDigest) => void;
}>;

const getCodemodNodeRenderer =
	({
		rootPath,
		progressBar,
		description,
		actionButtons,
		executionPath,
		autocompleteItems,
		pathDisplayValue,
		onClick,
		onDoubleClick,
	}: Deps) =>
	({ nodeDatum, onFlip, onFocus }: Props) => {
		const { node, depth, focused, expanded, childCount } = nodeDatum;

		const { hashDigest, label, kind } = node;

		const hasChildren = childCount !== 0;
		const icon = getIcon(nodeDatum);

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

		const targetPath = buildTargetPath(path, rootPath, repoName);

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
				id={hashDigest}
				ref={ref}
				className={cn(styles.root, focused && styles.focused)}
				onClick={() => {
					onFlip(hashDigest);
					onClick();
				}}
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
										'codicon-chevron-right': !expanded,
										'codicon-chevron-down': expanded,
									})}
								/>
							</div>
						) : null}
						{kind === 'CODEMOD' && description && (
							<Popover
								trigger={
									<div className={styles.icon}>{icon}</div>
								}
								position={['bottom left', 'top left']}
								mouseEnterDelay={300}
								popoverText={description}
							/>
						)}
						{(kind === 'DIRECTORY' || !description) && (
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
								>
									{label}
								</span>
							}
							popoverText="Double-click to open the documentation."
							disabled={editingPath || kind === 'DIRECTORY'}
						/>
						<span
							className={styles.directorySelector}
							style={{
								...(editingPath && {
									display: 'flex',
								}),
								...(pathDisplayValue !== null && {
									justifyContent: 'flex-end',
								}),
							}}
						>
							{kind === 'CODEMOD' && executionPath && (
								<DirectorySelector
									defaultValue={targetPath}
									displayValue={pathDisplayValue}
									rootPath={rootPath}
									error={
										error === null
											? null
											: { message: error }
									}
									// @ts-ignore
									hashDigest={hashDigest}
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
					<div className={cn(styles.actions)}>
						{actionButtons.map((el) => el)}
					</div>
				)}
			</div>
		);
	};

export { getCodemodNodeRenderer };