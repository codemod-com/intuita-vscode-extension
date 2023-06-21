import { useEffect, useRef, useState } from 'react';

import {
	VSCodePanels,
	VSCodePanelTab,
	VSCodePanelView,
} from '@vscode/webview-ui-toolkit/react';

import CodemodList from '../codemodList/App';
import CommunityView from '../communityView/App';
import CodemodRuns from './CodemodRuns';
import { WebviewMessage } from '../shared/types';

export enum TabKind {
	codemods = 'codemods',
	codemodRuns = 'codemodRuns',
	community = 'community',
}

function App() {
	const ref = useRef(null);
	const [screenWidth, setScreenWidth] = useState<number | null>(null);
	const [activeTabId, setActiveTabId] = useState(TabKind.codemods);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (message.kind === 'webview.main.setActiveTabId') {
				setActiveTabId(message.activeTabId);
			}
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

	return (
		<main className="App" ref={ref}>
			<VSCodePanels
				activeid={activeTabId}
				className="h-full w-full vscode-panels"
			>
				<VSCodePanelTab className="vscode-tab" id={TabKind.codemods}>
					Codemods Discovery
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id={TabKind.codemodRuns}>
					Codemod Runs
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id={TabKind.community}>
					Community
				</VSCodePanelTab>
				<VSCodePanelView className="h-full w-full">
					<CodemodList screenWidth={screenWidth} />
				</VSCodePanelView>
				<VSCodePanelView className="h-full w-full">
					<CodemodRuns screenWidth={screenWidth} />
				</VSCodePanelView>
				<VSCodePanelView className="h-full w-full">
					<CommunityView screenWidth={screenWidth} />
				</VSCodePanelView>
			</VSCodePanels>
		</main>
	);
}

export default App;
