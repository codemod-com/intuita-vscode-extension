import { useEffect } from 'react';
import { WebviewMessage } from './types';
import { vscode } from './utilities/vscode';

const useFocus = (ref: React.MutableRefObject<HTMLElement>, id: string) => {
	useEffect(() => {
		const handler = (event: MessageEvent<WebviewMessage>) => {
			const message = event.data;

			if (
				message.kind === 'webview.global.setFocus' &&
				message.id === id
			) {
				ref.current?.focus();
			}
		};

		window.addEventListener('message', handler);

		const keyDownHandler = (e: KeyboardEvent) => {
			if (
				['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
					e.key,
				)
			) {
				vscode.postMessage({
					kind: 'webview.global.requestFocusChange',
					id,
					key: e.key,
				});
			}
		};

		ref.current?.addEventListener('keydown', keyDownHandler);

		return () => {
			window.removeEventListener('message', handler);

			// eslint-disable-next-line react-hooks/exhaustive-deps
			ref.current?.removeEventListener('keydown', keyDownHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);
};

export default useFocus;
