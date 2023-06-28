import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as EditMaterialIcon } from '../../assets/material-icons/edit.svg';
import { ReactComponent as DescriptionMaterialIcon } from '../../assets/material-icons/description.svg';
import styles from './style.module.css';
import cn from 'classnames';
import Popover from '../../shared/Popover';
import { DirectorySelector } from '../components/DirectorySelector';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';
import debounce from '../../shared/utilities/debounce';
import { vscode } from '../../shared/utilities/vscode';
import areEqual from 'fast-deep-equal';
import { CodemodNode } from '../../../../src/selectors/selectCodemodTree';
import { CodemodHash } from '../../shared/types';
import InfiniteProgress from '../TreeView/InfiniteProgress';
import ProgressBar from '../TreeView/ProgressBar';
import ActionButton from '../TreeView/ActionButton';
import throttle from '../../shared/utilities/throttle';
import { Progress } from '../useProgressBar';

const buildTargetPath = (path: string, rootPath: string, repoName: string) => {
	return path.replace(rootPath, '').length === 0
		? `${repoName}/`
		: path.replace(rootPath, repoName);
};

const handleCodemodPathChange = debounce((rawCodemodPath: string) => {
	const codemodPath = rawCodemodPath.trim();

	vscode.postMessage({
		kind: 'webview.codemodList.codemodPathChange',
		codemodPath,
	});
}, 50);

type CodemodItemNode = CodemodNode & { kind: 'CODEMOD' };

type Props = Omit<CodemodItemNode, 'name' | 'kind'> &
	Readonly<{
		rootPath: string;
		autocompleteItems: ReadonlyArray<string>;
		progress: Progress | null;
	}>;

const renderProgressBar = (progress: Progress | null) => {
	if (progress === null) {
		return null;
	}

	if (progress.progressKind === 'infinite') {
		<InfiniteProgress />;
	}

	return <ProgressBar progress={progress.value} />;
};

const renderActionButtons = (
	hashDigest: CodemodItemNode['hashDigest'],
	codemodInProgress: boolean,
	queued: boolean,
	doesDisplayShortenedTitle: boolean,
) => {
	if (!codemodInProgress && !queued) {
		return (
			<ActionButton
				popoverText="Run this codemod without making change to file system"
				onClick={(e) => {
					e.stopPropagation();

					vscode.postMessage({
						kind: 'webview.codemodList.dryRunCodemod',
						value: hashDigest as unknown as CodemodHash,
					});
				}}
			>
				{doesDisplayShortenedTitle ? '✓' : '✓ Dry Run'}
			</ActionButton>
		);
	}

	if (!codemodInProgress && queued) {
		return (
			<Popover
				trigger={<i className="codicon codicon-history mr-2" />}
				popoverText="This codemod has already been queued for execution."
			/>
		);
	}

	return (
		<ActionButton
			popoverText="Stop Codemod Execution"
			iconName="codicon-debug-stop"
			onClick={(e) => {
				e.stopPropagation();
				vscode.postMessage({
					kind: 'webview.codemodList.haltCodemodExecution',
					value: hashDigest as unknown as CodemodHash,
				});
			}}
		/>
	);
};

const Codemod = ({
	hashDigest,
	label,
	executionPath,
	description,
	rootPath,
	autocompleteItems,
	progress,
	queued,
}: Props) => {
	const [notEnoughSpace, setNotEnoughSpace] = useState<boolean>(false);
	const directorySelectorRef = useRef<HTMLSpanElement>(null);
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

		const resizeHandler: ResizeObserverCallback = (entries) => {
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
		};

		const resizeObserver = new ResizeObserver(throttle(resizeHandler, 300));

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
		<>
			{!editingPath ? (
				<Popover
					trigger={
						<div className={styles.icon}>
							<DescriptionMaterialIcon fill="var(--vscode-icon-foreground)" />
						</div>
					}
					position={['bottom left', 'top left']}
					mouseEnterDelay={300}
					popoverText={description || 'Missing description'}
				/>
			) : null}
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
						disabled={editingPath}
					/>
					<span
						className={styles.directorySelector}
						ref={directorySelectorRef}
						style={{
							...(editingPath && {
								display: 'flex',
								width: '100%',
								opacity: 1,
							}),
						}}
					>
						{executionPath && (
							<DirectorySelector
								defaultValue={targetPath}
								displayValue={
									notEnoughSpace ? (
										<EditMaterialIcon
											style={{
												width: '16px',
												height: '16px',
											}}
										/>
									) : null
								}
								rootPath={rootPath}
								error={
									error === null ? null : { message: error }
								}
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
				{renderProgressBar(progress)}
			</div>
			{}
			{!editingPath && (
				<div className={cn(styles.actions)}>
					{renderActionButtons(
						hashDigest,
						progress !== null,
						queued,
						notEnoughSpace,
					)}
				</div>
			)}
		</>
	);
};

export default memo(Codemod, areEqual);
