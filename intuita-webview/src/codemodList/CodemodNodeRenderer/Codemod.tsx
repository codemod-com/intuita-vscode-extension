import { memo, useCallback, useState } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import IntuitaPopover from '../../shared/IntuitaPopover';
import { DirectorySelector } from '../components/DirectorySelector';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';
import debounce from '../../shared/utilities/debounce';
import { vscode } from '../../shared/utilities/vscode';
import areEqual from 'fast-deep-equal';
import { CodemodNode } from '../../../../src/selectors/selectCodemodTree';
import { CodemodHash } from '../../shared/types';
import { InfiniteProgress } from '../TreeView/InfiniteProgress';
import { ProgressBar } from '../TreeView/ProgressBar';
import ActionButton from '../TreeView/ActionButton';
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
		screenWidth: number | null;
	}>;

const renderProgressBar = (progress: Progress | null) => {
	if (progress === null) {
		return null;
	}

	if (progress.progressKind === 'infinite') {
		return <InfiniteProgress />;
	}

	return <ProgressBar percent={progress.value} />;
};

const renderActionButtons = (
	hashDigest: CodemodItemNode['hashDigest'],
	codemodInProgress: boolean,
	queued: boolean,
) => {
	if (!codemodInProgress && !queued) {
		return (
			<ActionButton
				content="Dry-run this codemod (without making change to file system)."
				onClick={(e) => {
					e.stopPropagation();

					vscode.postMessage({
						kind: 'webview.codemodList.dryRunCodemod',
						value: hashDigest as unknown as CodemodHash,
					});
				}}
			>
				<span className={cn('codicon', 'codicon-play')} />
			</ActionButton>
		);
	}

	if (!codemodInProgress && queued) {
		return (
			<IntuitaPopover content="This codemod has already been queued for execution.">
				<i className="codicon codicon-history mr-2" />
			</IntuitaPopover>
		);
	}

	return (
		<ActionButton
			content="Stop Codemod Execution"
			iconName="codicon-debug-stop"
			onClick={(e) => {
				e.stopPropagation();
				vscode.postMessage({
					kind: 'webview.codemodList.haltCodemodExecution',
				});
			}}
		/>
	);
};

const Codemod = ({
	hashDigest,
	label,
	executionPath,
	rootPath,
	autocompleteItems,
	progress,
	queued,
	intuitaCertified,
	screenWidth,
}: Props) => {
	const notEnoughSpace = screenWidth !== null && screenWidth <= 330;
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

	return (
		<>
			{!editingPath && (
				<IntuitaPopover
					content={
						intuitaCertified
							? 'This is a high-quality, Intuita-verified codemod.'
							: 'This is a community codemod.'
					}
				>
					{intuitaCertified ? (
						<span
							className={cn('codicon', 'codicon-verified')}
							style={{
								color: 'var(--vscode-focusBorder)',
							}}
						/>
					) : (
						<span className={cn('codicon', 'codicon-unverified')} />
					)}
				</IntuitaPopover>
			)}
			<div className="flex w-full flex-col">
				<span className={styles.labelContainer}>
					{!editingPath && (
						<span
							className={styles.label}
							style={{
								...(notEnoughSpace && {
									flex: screenWidth / 430,
									...(screenWidth < 250 && {
										flex: screenWidth / 710,
									}),
								}),
							}}
						>
							{label}
						</span>
					)}
					<div
						style={{
							display: 'flex',
							marginLeft: 'auto',
							...(notEnoughSpace && {
								marginLeft: 0,
							}),
						}}
					>
						<span
							className={styles.directorySelector}
							style={{
								...(editingPath && {
									width: '100%',
									opacity: 1,
									marginRight: '2.5px',
								}),
							}}
						>
							{executionPath && (
								<DirectorySelector
									defaultValue={targetPath}
									displayValue={'path'}
									rootPath={rootPath}
									error={
										error === null
											? null
											: { message: error }
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
						{!editingPath && (
							<div className={cn(styles.actions)}>
								{renderActionButtons(
									hashDigest,
									progress !== null,
									queued,
								)}
							</div>
						)}
					</div>
				</span>
				{renderProgressBar(progress)}
			</div>
		</>
	);
};

export default memo(Codemod, areEqual);
