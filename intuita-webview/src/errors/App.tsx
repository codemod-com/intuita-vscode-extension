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
import { ExecutionError } from '../../../src/errors/types';
import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';

type ErrorsViewProps = Extract<View, { viewId: 'errors' }>['viewProps'];

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
			errorProps: ErrorsViewProps;
		};
		mainWebviewViewProps: MainWebviewViewProps;
	}
}

export const App = () => {
	const [viewProps, setViewProps] = useState(window.INITIAL_STATE.errorProps);

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

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (viewProps.kind !== 'CASE_SELECTED') {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					{viewProps.kind === 'MAIN_WEBVIEW_VIEW_NOT_VISIBLE'
						? 'Open the left-sided Intuita View Container to see the errors.'
						: viewProps.kind === 'CODEMOD_RUNS_TAB_NOT_ACTIVE'
						? 'Open the Codemod Runs tab to see the errors.'
						: 'Choose a codemod run from Codemod Runs to see its errors.'}
				</p>
			</main>
		);
	}

	if (viewProps.executionErrors.length === 0) {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					No execution errors found for the selected codemod run.
				</p>
			</main>
		);
	}

	const rows = viewProps.executionErrors.map(buildExecutionErrorRow);

	return (
		<main>
			<VSCodeDataGrid gridTemplateColumns="10% 45% 45%">
				{header}
				{rows}
			</VSCodeDataGrid>
		</main>
	);
};
