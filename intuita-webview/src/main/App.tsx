import {
	useEffect,
	useRef,
	useState,
} from 'react';

import { VSCodePanels, VSCodePanelTab, VSCodePanelView, VSCodeBadge }  from '@vscode/webview-ui-toolkit/react';

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
			<VSCodePanels>
				<VSCodePanelTab id='tab-1'>Codemods Discovery</VSCodePanelTab>
				<VSCodePanelTab id='tab-2'>
					Codemod Runs
					<VSCodeBadge>34</VSCodeBadge>
					</VSCodePanelTab>
				<VSCodePanelTab id='tab-3'>Community</VSCodePanelTab>
				<VSCodePanelView>
					<CodemodList screenWidth={screenWidth} />
				</VSCodePanelView>
				<VSCodePanelView>
					<CodemodRuns  screenWidth={screenWidth} />
				</VSCodePanelView>
				<VSCodePanelView>
					<CommunityView screenWidth={screenWidth} />
				</VSCodePanelView>
			</VSCodePanels>
		</main>
	);
}

export default App;
