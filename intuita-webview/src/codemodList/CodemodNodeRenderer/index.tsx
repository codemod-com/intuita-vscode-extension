import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import Popover from '../../shared/Popover';
import { DirectorySelector } from '../components/DirectorySelector';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';
import debounce from '../../shared/utilities/debounce';
import { vscode } from '../../shared/utilities/vscode';
import {
	CodemodNodeHashDigest,
	CodemodNode,
} from '../../../../src/selectors/selectCodemodTree';
import { NodeDatum } from '../../intuitaTreeView';

import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { CodemodHash } from '../../shared/types';

const buildTargetPath = (path: string, rootPath: string, repoName: string) => {
	return path.replace(rootPath, '').length === 0
		? `${repoName}/`
		: path.replace(rootPath, repoName);
};

const getIcon = (
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>,
): ReactNode => {
	const { expanded, node } = nodeDatum;
	const { kind } = node;

	if (kind === 'CODEMOD') {
		return <CaseIcon />;
	}

	if (kind === 'DIRECTORY') {
		return (
			<span
				className={cn('codicon', {
					'codicon-folder': !expanded,
					'codicon-folder-opened': expanded,
				})}
			/>
		);
	}

	return <BlueLightBulbIcon />;
};

const getContainerInlineStyles = ({
	depth,
}: NodeDatum<CodemodNodeHashDigest, CodemodNode>) => {
	return {
		...(depth === 1 && {
			minWidth: '0.25rem',
		}),
		...(depth > 1 && {
			minWidth: `${5 + depth * 16}px`,
		}),
	};
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
	autocompleteItems: string[];
	progressBar: (node: CodemodNode) => JSX.Element | null;
	actionButtons: (
		node: CodemodNode,
		doesDisplayShortenedTitle: boolean,
	) => ReactNode[];
	onDoubleClick(node: CodemodNode): void;
};

type Props = Readonly<{
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>;
	onFlip: (hashDigest: CodemodNodeHashDigest) => void;
	onFocus: (hashDigest: CodemodNodeHashDigest) => void;
}>;

const getCodemodNodeRenderer =
	({
		rootPath,
		autocompleteItems,
		progressBar,
		actionButtons,
		onDoubleClick,
	}: Deps) =>
	({ nodeDatum, onFlip }: Props) => {
		const { node, focused, expanded, childCount } = nodeDatum;

		const { hashDigest, label, kind } = node;

		const executionPath =
			node.kind === 'CODEMOD' ? node.executionPath : null;
		const description = node.kind === 'CODEMOD' ? 'description' : '';

		const hasChildren = childCount !== 0;
		const icon = getIcon(nodeDatum);

		const [notEnoughSpace, setNotEnoughSpace] = useState<boolean>(false);
		const directorySelectorRef = useRef<HTMLSpanElement>(null);
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

		// @TODO check if can be implemented using css container queries
		useEffect(() => {
			if (ResizeObserver === undefined) {
				return undefined;
			}

			const resizeObserver = new ResizeObserver((entries) => {
				const treeItem = entries[0] ?? null;
				if (treeItem === null) {
					return;
				}

				if (directorySelectorRef.current === null) {
					return;
				}

				const xDistance = Math.abs(
					directorySelectorRef.current.getBoundingClientRect().right -
						treeItem.target.getBoundingClientRect().right,
				);

				setNotEnoughSpace(xDistance < 100);
			});

			const treeItem = document.getElementById(hashDigest);

			if (treeItem === null) {
				return;
			}
			resizeObserver.observe(treeItem);

			return () => {
				resizeObserver.disconnect();
			};
		}, [hashDigest]);

		return (
			<div
				id={hashDigest}
				ref={ref}
				className={cn(styles.root, focused && styles.focused)}
				onClick={() => {
					onFlip(hashDigest);
				}}
				onDoubleClick={() => onDoubleClick(node)}
			>
				<div style={getContainerInlineStyles(nodeDatum)} />
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
							ref={directorySelectorRef}
							style={{
								...(editingPath && {
									display: 'flex',
									width: '100%',
								}),
							}}
						>
							{kind === 'CODEMOD' && executionPath && (
								<DirectorySelector
									defaultValue={targetPath}
									displayValue={notEnoughSpace ? '🎯' : null}
									rootPath={rootPath}
									error={
										error === null
											? null
											: { message: error }
									}
									// @TODO CodemodHash type will be replaced in next PRs
									codemodHash={
										hashDigest as unknown as CodemodHash
									}
									onEditStart={onEditStart}
									onEditEnd={onEditEnd}
									onEditCancel={onEditCancel}
									onChange={handleCodemodPathChange}
									autocompleteItems={autocompleteItems}
								/>
							)}
						</span>
					</span>
					{progressBar(node)}
				</div>
				{!editingPath && (
					<div className={cn(styles.actions)}>
						{actionButtons(node, false).map((el) => el)}
					</div>
				)}
			</div>
		);
	};

export { getCodemodNodeRenderer };
