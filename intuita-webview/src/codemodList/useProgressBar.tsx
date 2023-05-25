import { useEffect, useRef, useState } from 'react';
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
	runningRepomodHash: CodemodHash | null,
): [
	ProgressType | null,
	{
		progressBar: JSX.Element | null;
		stopProgress: JSX.Element | null;
	},
] => {
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [codemodExecutionProgress, setCodemodExecutionProgress] =
		useState<null | ProgressType>(null);

	const handleClearInterval = () => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setCodemodExecutionProgress(null);
	};

	const handleStopCodemodExecution = (hash: CodemodHash) => {
		handleClearInterval();
		if (!hash) {
			return;
		}
		vscode.postMessage({
			kind: 'webview.codemodList.haltCodemodExecution',
			value: hash,
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
				handleClearInterval();
				setCodemodExecutionProgress(null);
				onHalt();
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [codemodExecutionProgress?.codemodHash, onHalt]);

	useEffect(() => {
		if (runningRepomodHash === null) {
			return;
		}
		intervalRef.current = setInterval(() => {
			setCodemodExecutionProgress((prev) => {
				return {
					progress:
						prev?.progress !== undefined
							? (prev.progress + 25) % 125
							: 0,
					codemodHash: runningRepomodHash,
				};
			});
		}, 400);

		return () => {
			handleClearInterval();
		};
	}, [runningRepomodHash]);

	const progressBar =
		codemodExecutionProgress !== null ? (
			<>
				<div
					className="flex mb-2"
					style={{ height: '3.5px', width: '90%' }}
				>
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
				onHalt();
				handleStopCodemodExecution(
					codemodExecutionProgress.codemodHash,
				);
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
