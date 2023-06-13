import CampaignManager from '../campaignManager/App';
import CodemodList from '../codemodList/App';
import FileExplorer from '../fileExplorer/App';
import CommunityView from '../communityView/App';

function App() {
	return (
		<main className="App">
			{/* @TODO add resizable pane instead of block */}
			<div className="block">
				<CodemodList />
			</div>
			<div className="block">
				<CampaignManager />
			</div>
			<div className="block">
				<FileExplorer />
			</div>
			<div className="block">
				<CommunityView />
			</div>
		</main>
	);
}

export default App;
