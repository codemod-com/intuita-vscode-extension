import { useCallback, useEffect } from 'react';
/**
 * Hook that detects when ctl/meta + key is pressed
 */

export const useCTLKey = (key: string, callback: () => void) => {
	const keyPressCallback = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === key && (event.ctrlKey || event.metaKey)) {
				callback();
			}
		},
		[callback, key],
	);

	useEffect(() => {
		document.addEventListener('keydown', keyPressCallback);

		return () => document.removeEventListener('keydown', keyPressCallback);
	}, [keyPressCallback]);
};
