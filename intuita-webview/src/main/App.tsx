import {
	PanelGroup,
	PanelResizeHandle,
	ImperativePanelHandle,
} from 'react-resizable-panels';
import CampaignManager from '../campaignManager/App';
import CodemodList from '../codemodList/App';
import FileExplorer from '../fileExplorer/App';
import CommunityView from '../communityView/App';
import { ResizablePanel } from '../shared/Panel';
import { CSSProperties, ReactElement, useEffect, useRef } from 'react';
import SectionHeader from '../shared/SectionHeader';
import { WebviewMessage } from '../shared/types';
import { CollapsibleWebviews } from '../../../src/components/webview/webviewEvents';

const PANELS: {
	id: CollapsibleWebviews;
	title: string;
	Component: () => ReactElement | null;
	commands?: any[];
	inlineStyle?: CSSProperties;
}[] = [
	{
		id: 'codemodDiscoveryView',
		title: 'Codemod Discovery',
		Component: CodemodList,
	},
	{
		id: 'codemodRunsView',
		title: 'Codemod Runs',
		commands: [
			{
				icon: 'clear-all',
				title: 'Clear all',
				command: 'intuita.clearState',
			},
		],
		Component: CampaignManager,
	},
	{
		id: 'changeExplorerView',
		title: 'Changes Explorer',
		Component: FileExplorer,
	},
	{
		id: 'communityView',
		title: 'Community',
		Component: CommunityView,
	},
];

function App() {
	const panelRefs = useRef<Record<string, ImperativePanelHandle>>({});

	const togglePanel = (id: string) => {
		const ref = panelRefs.current[id];

		if (!ref) {
			return;
		}
		const collapsed = ref.getCollapsed();
		if (collapsed) {
			ref.expand();
		} else {
			ref.collapse();
		}
	};

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (message.kind === 'webview.main.setCollapsed') {
				const ref = panelRefs.current[message.viewName];
				if (!ref) {
					return;
				}
				if (message.collapsed) {
					ref.collapse();
				} else {
					ref.expand();
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	return (
		<main className="App">
			<PanelGroup direction="vertical">
				{PANELS.map(
					(
						{
							id,
							title,
							commands = [],
							Component,
							inlineStyle = {},
						},
						idx,
					) => {
						const collapsed = panelRefs.current[id]?.getCollapsed();

						return (
							<>
								{idx !== 0 ? (
									<PanelResizeHandle className="resize-handle" />
								) : null}
								<SectionHeader
									title={title}
									commands={commands}
									defaultOpen={!collapsed}
									onHeaderClick={() => togglePanel(id)}
								/>
								<ResizablePanel
									collapsible
									minSize={0}
									defaultSize={25}
									ref={(ref) => {
										if (ref) {
											panelRefs.current[id] = ref;
										}
									}}
									style={{
										overflowY: 'scroll',
										overflowX: 'hidden',
										...inlineStyle,
									}}
								>
									<Component />
								</ResizablePanel>
							</>
						);
					},
				)}
			</PanelGroup>
		</main>
	);
}

export default App;
