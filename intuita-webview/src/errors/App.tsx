import { useEffect, useState } from 'react';
import styles from './style.module.css';
import {
	VSCodeDataGrid,
	VSCodeDataGridRow,
	VSCodeDataGridCell,
} from '@vscode/webview-ui-toolkit/react';
import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import { vscode } from '../shared/utilities/vscode';
import { ExecutionError } from '../../../src/errors/types';

type ErrorView = Extract<View, { viewId: 'errors' }>;

const header = (
	<VSCodeDataGridRow row-type="header">
		<VSCodeDataGridCell cell-type="columnheader" grid-column="1">
			Kind
		</VSCodeDataGridCell>
		<VSCodeDataGridCell cell-type="columnheader" grid-column="2">
			Message
		</VSCodeDataGridCell>
		<VSCodeDataGridCell cell-type="columnheader" grid-column="3">
			File Path
		</VSCodeDataGridCell>
	</VSCodeDataGridRow>
);

const buildExecutionErrorRow = (
	executionError: ExecutionError,
	index: number,
) => {
	const kind =
		typeof executionError !== 'string'
			? executionError.kind ?? 'errorRunningCodemod'
			: 'errorRunningCodemod';

	const message =
		typeof executionError !== 'string'
			? executionError.message
			: executionError;

	const filePath =
		typeof executionError !== 'string' ? executionError.filePath ?? '' : '';

	return (
		<VSCodeDataGridRow key={index}>
			<VSCodeDataGridCell grid-column="1">{kind}</VSCodeDataGridCell>
			<VSCodeDataGridCell grid-column="2">{message}</VSCodeDataGridCell>
			<VSCodeDataGridCell grid-column="3">{filePath}</VSCodeDataGridCell>
		</VSCodeDataGridRow>
	);
};

export const App = () => {
	const [view, setView] = useState<ErrorView | null>(null);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				if (message.value.viewId === 'errors') {
					setView(message.value);
				}
			}
		};

		window.addEventListener('message', handler);
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view) {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					Choose a codemod run from Codemod Runs to see its errors.
				</p>
			</main>
		);
	}

	const { executionErrors } = view.viewProps;

	if (executionErrors.length === 0) {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					No execution errors found for the selected codemon run.
				</p>
			</main>
		);
	}

	const rows = executionErrors.map(buildExecutionErrorRow);

	return (
		<main>
			<VSCodeDataGrid>
				{header}
				{rows}
			</VSCodeDataGrid>
		</main>
	);
};
