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

type ViewProps = Extract<View, { viewId: 'errors' }>['viewProps'];

const header = (
	<VSCodeDataGridRow row-type="sticky-header">
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

	const humanKind =
		kind === 'errorRunningCodemod' ? 'Execution Error' : 'Invalid Codemod';

	const message =
		typeof executionError !== 'string'
			? executionError.message
			: executionError;

	const filePath =
		typeof executionError !== 'string' ? executionError.filePath ?? '' : '';

	return (
		<VSCodeDataGridRow key={index}>
			<VSCodeDataGridCell grid-column="1">{humanKind}</VSCodeDataGridCell>
			<VSCodeDataGridCell grid-column="2">{message}</VSCodeDataGridCell>
			<VSCodeDataGridCell grid-column="3">{filePath}</VSCodeDataGridCell>
		</VSCodeDataGridRow>
	);
};

declare global {
	interface Window {
		INITIAL_STATE: {
			viewProps: View['viewProps'];
		};
	}
}

export const App = () => {
	const [viewProps, setViewProps] = useState<ViewProps>(
		window.INITIAL_STATE.viewProps as ViewProps,
	);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				if (message.value.viewId === 'errors') {
					setViewProps(message.value.viewProps);
				}
			}
		};

		window.addEventListener('message', handler);
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	const { caseHash, executionErrors } = viewProps;

	if (caseHash === null) {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					Choose a codemod run from Codemod Runs to see its errors.
				</p>
			</main>
		);
	}

	if (executionErrors.length === 0) {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					No execution errors found for the selected codemod run. $
					{caseHash}
				</p>
			</main>
		);
	}

	const rows = executionErrors.map(buildExecutionErrorRow);

	return (
		<main>
			<VSCodeDataGrid gridTemplateColumns="10% 45% 45%">
				{header}
				{rows}
			</VSCodeDataGrid>
		</main>
	);
};
