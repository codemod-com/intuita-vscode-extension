import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';

import {
	VSCodeButton,
	VSCodePanels,
	VSCodePanelTab,
	VSCodePanelView,
} from '@vscode/webview-ui-toolkit/react';

import { App as CodemodList } from '../codemodList/App';
import { CommunityTab } from '../communityTab/CommunityTab';
import { CodemodRuns } from './CodemodRuns';
import { WebviewMessage } from '../shared/types';
import { vscode } from '../shared/utilities/vscode';
import { ActiveTabId } from '../../../src/persistedState/codecs';
import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import CreateIssue from '../CreateIssue';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../shared/Snippet/useTheme';

const ToastContainerProps = {
	pauseOnHover: false,
	pauseOnFocusLoss: false,
	hideProgressBar: false,
	closeOnClick: false,
	closeButton: false,
	draggable: false,
	autoClose: false as const,
	enableMultiContainer: true,
};

declare global {
	interface Window {
		mainWebviewViewProps: MainWebviewViewProps;
	}
}

function App() {
	const ref = useRef(null);
	const theme = useTheme();
	const [screenWidth, setScreenWidth] = useState<number | null>(null);
	const [mainWebviewViewProps, setMainWebviewViewProps] = useState(
		window.mainWebviewViewProps,
	);

	useEffect(() => {
		const handler = (event: MessageEvent<WebviewMessage>) => {
			if (event.data.kind !== 'webview.main.setProps') {
				return;
			}

			setMainWebviewViewProps(event.data.props);
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	useEffect(() => {
		if (ResizeObserver === undefined) {
			return undefined;
		}

		if (ref.current === null) {
			return;
		}

		const resizeObserver = new ResizeObserver((entries) => {
			const container = entries[0] ?? null;
			if (container === null) {
				return;
			}
			const {
				contentRect: { width },
			} = container;

			setScreenWidth(width);
		});

		resizeObserver.observe(ref.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	useEffect(() => {
		if (mainWebviewViewProps.toaster === null) {
			return;
		}

		const { content, ...toasterProps } = mainWebviewViewProps.toaster;
		let componentToRender = null;

		if (toasterProps.toastId === 'handleSignedInUser') {
			componentToRender = (
				<div className="toasterComponent">
					<p>{content}</p>
					<VSCodeButton
						appearance="secondary"
						onClick={() => {
							toast.dismiss(toasterProps.toastId);
							vscode.postMessage({
								kind: 'webview.main.signOut',
							});
						}}
					>
						Sign out
					</VSCodeButton>
				</div>
			);
		}
		toast(componentToRender ?? content, toasterProps);

		// remove the current toaster props from Redux state
		vscode.postMessage({
			kind: 'webview.main.setToaster',
			value: null,
		});
	}, [mainWebviewViewProps.toaster]);

	const handlePanelTabClick = (id: ActiveTabId) => {
		vscode.postMessage({
			kind: 'webview.main.setActiveTabId',
			activeTabId: id,
		});
	};

	return (
		<main className="App" ref={ref}>
			<VSCodePanels
				activeid={mainWebviewViewProps.activeTabId}
				onChange={(e) => {
					const newValue =
						(e as unknown as { detail: HTMLElement | null }).detail
							?.id ?? null;

					if (newValue === null) {
						return;
					}

					if (newValue !== mainWebviewViewProps.activeTabId) {
						handlePanelTabClick(newValue as ActiveTabId);
					}
				}}
				className="h-full w-full vscode-panels"
			>
				<VSCodePanelTab className="vscode-tab" id={'codemods'}>
					Codemod Discovery
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id={'codemodRuns'}>
					Codemod Runs
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id={'community'}>
					Community
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id={'sourceControl'}>
					Github Issue
				</VSCodePanelTab>

				<VSCodePanelView
					className="vscode-panel-view h-full w-full"
					id="codemodsView"
				>
					{mainWebviewViewProps.activeTabId === 'codemods' ? (
						<CodemodList
							screenWidth={screenWidth}
							{...mainWebviewViewProps}
						/>
					) : null}
					<ToastContainer
						{...ToastContainerProps}
						containerId="codemodListToastContainer"
						position="bottom-right"
						theme={theme === 'vs-light' ? 'light' : 'dark'}
					/>
				</VSCodePanelView>
				<VSCodePanelView
					className="vscode-panel-view h-full w-full"
					id="codemodRunsView"
				>
					{mainWebviewViewProps.activeTabId === 'codemodRuns' ? (
						<CodemodRuns
							screenWidth={screenWidth}
							{...mainWebviewViewProps}
						/>
					) : null}
				</VSCodePanelView>
				<VSCodePanelView
					className="vscode-panel-view h-full w-full"
					id="communityView"
				>
					{mainWebviewViewProps.activeTabId === 'community' ? (
						<CommunityTab />
					) : null}
				</VSCodePanelView>
				<VSCodePanelView
					className="vscode-panel-view h-full w-full"
					id="createIssueView"
				>
					{mainWebviewViewProps.activeTabId === 'sourceControl' ? (
						<CreateIssue {...mainWebviewViewProps} />
					) : null}
				</VSCodePanelView>
			</VSCodePanels>
			<ToastContainer
				{...ToastContainerProps}
				containerId="primarySidebarToastContainer"
				theme={theme === 'vs-light' ? 'light' : 'dark'}
				position="top-right"
			/>
		</main>
	);
}

export default App;
