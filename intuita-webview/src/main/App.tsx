import { PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CampaignManager from '../campaignManager/App';
import CodemodList from '../codemodList/App';
import FileExplorer from '../fileExplorer/App';
import CommunityView from '../communityView/App';
import { ResizablePanel } from '../shared/Panel';
import Section from '../shared/Section';

function App() {
	return (
		<main className="App">
			<PanelGroup direction="vertical">
				<ResizablePanel collapsible minSize={0} defaultSize={25}>
					<Section title="Codemod Discovery" open>
						<CodemodList />
					</Section>
				</ResizablePanel>
				<PanelResizeHandle className="resize-handle" />
				<ResizablePanel collapsible minSize={0} defaultSize={25}>
					<Section
						title="Codemod Runs"
						commands={[
							{
								icon: 'clear-all',
								title: 'Clear all',
								command: 'intuita.clearState',
							},
						]}
						open
					>
						<CampaignManager />
					</Section>
				</ResizablePanel>
				<PanelResizeHandle className="resize-handle" />
				<ResizablePanel collapsible minSize={0} defaultSize={25}>
					<Section title="Changes Explorer" open>
						<FileExplorer />
					</Section>
				</ResizablePanel>
				<PanelResizeHandle className="resize-handle" />
				<ResizablePanel collapsible minSize={0} defaultSize={25}>
					<Section title="Community" open>
						<CommunityView />
					</Section>
				</ResizablePanel>
			</PanelGroup>
		</main>
	);
}

export default App;
