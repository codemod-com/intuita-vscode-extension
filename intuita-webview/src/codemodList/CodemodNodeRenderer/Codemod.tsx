import {  memo, useCallback, useEffect, useRef, useState } from 'react';
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

import {
	CodemodNodeHashDigest,
	CodemodNode,
} from '../../../../src/selectors/selectCodemodTree';
import { NodeDatum } from '../../intuitaTreeView';

import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { CodemodHash } from '../../shared/types';
import InfiniteProgress from '../TreeView/InfiniteProgress';
import ProgressBar from '../TreeView/ProgressBar';
import ActionButton from '../TreeView/ActionButton';

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

type CodemodLeafNode = CodemodNode & { kind: 'CODEMOD' };

type Props = Readonly<{
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodLeafNode>;
	rootPath: string;
	autocompleteItems: ReadonlyArray<string>;
	progress: number | null;
}>;

const renderProgressBar = (node: CodemodLeafNode, progress: number) => {
	return node.codemodKind === 'repomod' ? (
		<InfiniteProgress />
	) : (
		<ProgressBar progress={progress} />
	);
};

const renderActionButtons = (
	node: CodemodLeafNode,
	codemodInProgress: boolean,
) => {
	if (!codemodInProgress) {
		return (
			<ActionButton
				popoverText="Run this codemod without making change to file system"
				onClick={(e) => {
					e.stopPropagation();

					vscode.postMessage({
						kind: 'webview.codemodList.dryRunCodemod',
						value: node.hashDigest as unknown as CodemodHash,
					});
				}}
			>
				✓ Dry Run
			</ActionButton>
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
					value: node.hashDigest as unknown as CodemodHash,
				});
			}}
		/>
	);
};

const Codemod = ({
	nodeDatum,
	rootPath,
	autocompleteItems,
	progress,
}: Props) => {
	const { node } = nodeDatum;

	const { hashDigest, label, executionPath, description } = node;

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


	const codemodInProgress = progress !== null;
	console.log('CODEMOD RENERED')
	return (
		<>
			{!editingPath ? (
				<Popover
					trigger={
						<div className={styles.icon}>
							<CaseIcon />
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
								displayValue={notEnoughSpace ? '🎯' : null}
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
				{codemodInProgress ? renderProgressBar(node, progress) : null}
			</div>
			{}
			{!editingPath && (
				<div className={cn(styles.actions)}>{renderActionButtons(node, codemodInProgress)}</div>
			)}
		</>
	);
};

export default memo(Codemod, areEqual);
