import { useEffect, useState } from 'react';
import { CodemodHash, WebviewMessage } from '../shared/types';

export type Progress = Readonly<{
	codemodHash: CodemodHash;
	progressKind: 'finite' | 'infinite';
	value: number;
}>;

export const useProgressBar = (): Progress | null => {
	const [codemodExecutionProgress, setCodemodExecutionProgress] =
		useState<Progress | null>(null);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setCodemodExecutionProgress') {
				setCodemodExecutionProgress({
					codemodHash: message.codemodHash,
					progressKind: message.progressKind,
					value: message.value,
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
