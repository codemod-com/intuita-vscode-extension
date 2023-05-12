import { useEffect, useState } from 'react';
import { Line } from 'rc-progress';
import { CodemodHash, WebviewMessage } from '../shared/types';
import styles from './TreeView/style.module.css';
import { vscode } from '../shared/utilities/vscode';

type ProgressType = {
	progress: number;
	codemodHash: CodemodHash;
};

export const useProgressBar = (
	onHalt: () => void,
): [
	ProgressType | null,
	{
		progressBar: JSX.Element | null;
		stopProgress: JSX.Element | null;
	},
] => {
	const [codemodExecutionProgress, setCodemodExecutionProgress] =
		useState<null | ProgressType>(null);

	const handleStopCodemodExecution = () => {
		if (!codemodExecutionProgress) {
			return;
		}
		vscode.postMessage({
			kind: 'webview.codemodList.haltCodemodExecution',
			value: codemodExecutionProgress.codemodHash,
		});
	};

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setCodemodExecutionProgress') {
				setCodemodExecutionProgress({
					progress: message.value,
					codemodHash: message.codemodHash,
				});
			}

			if (message.kind === 'webview.global.codemodExecutionHalted') {
				setCodemodExecutionProgress(null);
				onHalt();
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [codemodExecutionProgress?.codemodHash, onHalt]);

	const progressBar =
		codemodExecutionProgress !== null ? (
			<>
				<div className="flex w-full" style={{ height: '3.5px' }}>
					<Line
						percent={codemodExecutionProgress.progress}
						strokeWidth={1.5}
						className="w-full"
						strokeLinecap="round"
						trailColor="var(--scrollbar-slider-background)"
						strokeColor="var(--vscode-progressBar-background)"
					/>
				</div>
			</>
		) : null;

	const stopProgress = codemodExecutionProgress ? (
		// eslint-disable-next-line jsx-a11y/anchor-is-valid
		<a
			className={styles.action}
			role="button"
			onClick={(e) => {
				e.stopPropagation();
				handleStopCodemodExecution();
			}}
			title="Stop Codemod Execution"
		>
			<i className="codicon codicon-debug-stop" />
		</a>
	) : null;

	return [
		codemodExecutionProgress,
		{
			progressBar,
			stopProgress,
		},
	];
};
