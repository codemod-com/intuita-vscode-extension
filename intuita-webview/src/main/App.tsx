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
import { useRef, useState } from 'react';
import SectionHeader from '../shared/Section/Header';

const PANELS = [
	{
		id: 'codemodDiscovery',
		title: 'Codemod Discovery',
		Component: CodemodList,
	},
	{
		id: 'codemodRuns',
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
		id: 'changesExplorer',
		title: 'Changes Explorer',
		Component: FileExplorer,
	},
	{
		id: 'community',
		title: 'Community',
		Component: CommunityView,
	},
];

function App() {
	const panelRefs = useRef<Record<string, ImperativePanelHandle>>({});
	const [, forceRerender] = useState('');

	const togglePanel = (id: string) => {
		const ref = panelRefs.current[id];

		if (!ref) {
			return;
		}

		if (ref.getCollapsed()) {
			ref.expand();
		} else {
			ref.collapse();
		}

		forceRerender(crypto.randomUUID());
	};

	return (
		<main className="App">
			<PanelGroup direction="vertical">
				{PANELS.map(({ id, title, commands = [], Component }, idx) => {
					const collapsed = panelRefs.current[id]?.getCollapsed();

					return (
						<>
							{idx !== 0 ? (
								<PanelResizeHandle className="resize-handle" />
							) : null}
							<SectionHeader
								title={title}
								commands={commands}
								open={!collapsed}
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
							>
								<Component />
							</ResizablePanel>
						</>
					);
				})}
			</PanelGroup>
		</main>
	);
}

export default App;
