import { useCallback, useState } from 'react';
import { RunCodemodsCommand, CodemodHash } from '../../shared/types';
import { vscode } from '../../shared/utilities/vscode';

import { useProgressBar } from '../useProgressBar';

import {
	CodemodNode,
	CodemodNodeHashDigest,
	CodemodTree,
} from '../../../../src/selectors/selectCodemodTree';
import { IntuitaTreeView } from '../../intuitaTreeView';
import { getCodemodNodeRenderer } from '../CodemodNodeRenderer';
import Popover from '../../shared/Popover';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import s from './style.module.css';

type Props = Readonly<{
	tree: CodemodTree;
	autocompleteItems: string[];
	rootPath: string;
}>;

const handleDoubleClick = (node: CodemodNode) => {
	vscode.postMessage({
		kind: 'webview.command',
		value: {
			title: 'Show codemod metadata',
			command: 'intuita.showCodemodMetadata',
			arguments: [node.hashDigest],
		},
	});
};

const onFocus = (hashDigest: CodemodNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.selectCodemodNodeHashDigest',
		selectedCodemodNodeHashDigest: hashDigest,
	});
};

const onFlip = (hashDigest: CodemodNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.flipCodemodHashDigest',
		codemodNodeHashDigest: hashDigest,
	});

	onFocus(hashDigest);
};

const TreeView = ({ tree, autocompleteItems, rootPath }: Props) => {
	/**
	 * Progress bar
	 * @TODO hide progress bar logic
	 */
	const [executionStack, setExecutionStack] = useState<
		ReadonlyArray<CodemodNodeHashDigest>
	>([]);

	const [runningRepomodHash, setRunningRepomodHash] =
		useState<CodemodNodeHashDigest | null>(null);

	const onHalt = useCallback(() => {
		setRunningRepomodHash(null);

		if (!executionStack.length) {
			return;
		}
		const stack = executionStack.slice();
		const hash = stack.shift();

		if (!hash) {
			return;
		}

		setExecutionStack(stack);
		vscode.postMessage({
			kind: 'webview.codemodList.dryRunCodemod',
			// @TODO
			value: hash as unknown as CodemodHash,
		});
	}, [executionStack]);

	const [progress, { progressBar, stopProgress }] = useProgressBar(
		onHalt,
		// @TODO make generic
		runningRepomodHash as CodemodHash | null,
	);

	const handleActionButtonClick = useCallback(
		(action: RunCodemodsCommand) => {
			// @TODO
			const actionValue =
				action.value as unknown as CodemodNodeHashDigest;
			if (
				(progress || executionStack.length) &&
				action.kind === 'webview.codemodList.dryRunCodemod'
			) {
				if (executionStack.includes(actionValue)) {
					return;
				}
				setExecutionStack((prev) => [...prev, actionValue]);
				return;
			}

			vscode.postMessage(action);
		},
		[executionStack, progress],
	);

	// @TODO move to other component
	const actionButtons = (
		node: CodemodNode,
		actions: RunCodemodsCommand[],
		doesDisplayShortenedTitle: boolean,
	) => {
		if (node.kind !== 'CODEMOD') {
			return [];
		}

		return (actions ?? []).map((action) => {
			const actionValue =
				action.value as unknown as CodemodNodeHashDigest;
			return (
				<Popover
					trigger={
						<VSCodeButton
							key={action.kind}
							className={s.action}
							appearance="icon"
							onClick={(e) => {
								e.stopPropagation();
								handleActionButtonClick(action);
								if (
									action.kind ===
										'webview.codemodList.dryRunCodemod' &&
									node.codemodKind === 'repomod'
								) {
									setRunningRepomodHash(node.hashDigest);
								}
							}}
						>
							{action.kind ===
								'webview.codemodList.dryRunCodemod' &&
								executionStack.includes(actionValue) && (
									<i className="codicon codicon-history mr-2" />
								)}
							{doesDisplayShortenedTitle
								? action.shortenedTitle
								: action.title}
						</VSCodeButton>
					}
					popoverText={`${
						action.kind === 'webview.codemodList.dryRunCodemod' &&
						executionStack.includes(actionValue)
							? 'Queued:'
							: ''
					} ${action.description}`}
				/>
			);
		});
	};

	const getActionButtons = (
		node: CodemodNode,
		doesDisplayShortenedTitle: boolean,
	) => {
		if (node.kind !== 'CODEMOD') {
			return [];
		}

		if (node.codemodKind === 'repomod' && runningRepomodHash !== null) {
			return [];
		}

		if (
			// @TODO
			progress?.codemodHash ===
				(node.hashDigest as unknown as CodemodHash) &&
			node.codemodKind === 'executeCodemod'
		) {
			return [stopProgress];
		}

		const actions = [
			{
				title: '✓ Dry Run',
				shortenedTitle: '✓',
				description:
					'Run this codemod without making change to file system',
				kind: 'webview.codemodList.dryRunCodemod' as const,
				value: node.hashDigest as unknown as CodemodHash,
			},
		];

		return actionButtons(node, actions, doesDisplayShortenedTitle);
	};

	return (
		<IntuitaTreeView<CodemodNodeHashDigest, CodemodNode>
			{...tree}
			nodeRenderer={getCodemodNodeRenderer({
				autocompleteItems,
				rootPath,
				onDoubleClick: handleDoubleClick,
				progressBar: (node: CodemodNode) =>
					progress?.codemodHash ===
					(node.hashDigest as unknown as CodemodHash)
						? progressBar
						: null,
				actionButtons: (node, doesDisplayShortenedTitle) =>
					getActionButtons(node, doesDisplayShortenedTitle),
			})}
			onFlip={onFlip}
			onFocus={onFocus}
		/>
	);
};

export default TreeView;
