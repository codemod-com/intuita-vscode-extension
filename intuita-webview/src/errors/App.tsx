import { useEffect, useState } from 'react';
import styles from './style.module.css';
import {
	VSCodeDataGrid,
	VSCodeDataGridRow,
	VSCodeDataGridCell,
} from '@vscode/webview-ui-toolkit/react';
import type { WebviewMessage } from '../../../src/components/webview/webviewEvents';
import { ExecutionError } from '../../../src/errors/types';
import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import { ErrorWebviewViewProps } from '../../../src/selectors/selectErrorWebviewViewProps';

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
		errorWebviewViewProps: ErrorWebviewViewProps;
		mainWebviewViewProps: MainWebviewViewProps;
	}
}

export const App = () => {
	const [props, setProps] = useState(window.errorWebviewViewProps);

	useEffect(() => {
		const handler = (event: MessageEvent<WebviewMessage>) => {
			if (event.data.kind !== 'webview.error.setProps') {
				return;
			}

			setProps(event.data.errorWebviewViewProps);
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (props.kind !== 'CASE_SELECTED') {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					{props.kind === 'MAIN_WEBVIEW_VIEW_NOT_VISIBLE'
						? 'Open the left-sided Intuita View Container to see the errors.'
						: props.kind === 'CODEMOD_RUNS_TAB_NOT_ACTIVE'
						? 'Open the Codemod Runs tab to see the errors.'
						: 'Choose a codemod run from Codemod Runs to see its errors.'}
				</p>
			</main>
		);
	}

	if (props.executionErrors.length === 0) {
		return (
			<main>
				<p className={styles.welcomeMessage}>
					No execution errors found for the selected codemod run.
				</p>
			</main>
		);
	}

	const rows = props.executionErrors.map(buildExecutionErrorRow);

	return (
		<main>
			<VSCodeDataGrid gridTemplateColumns="10% 45% 45%">
				{header}
				{rows}
			</VSCodeDataGrid>
		</main>
	);
};
