import { useEffect, useState } from 'react';
import { CodemodHash, WebviewMessage } from '../shared/types';

export type ProgressType = {
	progress: number;
	codemodHash: CodemodHash;
};

export const useProgressBar = (): ProgressType | null => {
	const [codemodExecutionProgress, setCodemodExecutionProgress] =
		useState<null | ProgressType>(null);

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
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [codemodExecutionProgress?.codemodHash]);

	return codemodExecutionProgress;
};
