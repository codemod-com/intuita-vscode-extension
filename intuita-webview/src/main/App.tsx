import { useEffect, useRef, useState } from 'react';

import {
	VSCodePanels,
	VSCodePanelTab,
	VSCodePanelView,
	VSCodeBadge,
} from '@vscode/webview-ui-toolkit/react';

import CodemodList from '../codemodList/App';
import CommunityView from '../communityView/App';
import CodemodRuns from './CodemodRuns';

function App() {
	const ref = useRef(null);
	const [screenWidth, setScreenWidth] = useState<number | null>(null);

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
			<VSCodePanels className="h-full w-full vscode-panels">
				<VSCodePanelTab className="vscode-tab" id="tab-1">
					Codemods Discovery
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id="tab-2">
					Codemod Runs
				</VSCodePanelTab>
				<VSCodePanelTab className="vscode-tab" id="tab-3">
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
