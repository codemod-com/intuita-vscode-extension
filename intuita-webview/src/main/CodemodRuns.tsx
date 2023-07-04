import { CSSProperties, useEffect, useRef } from 'react';

import {
	PanelResizeHandle,
	ImperativePanelHandle,
	PanelGroupStorage,
} from 'react-resizable-panels';

import { ResizablePanel, PanelGroup } from '../shared/Panel';
import SectionHeader from '../shared/SectionHeader';
import { WebviewMessage } from '../shared/types';

import { App as CampaignManager } from '../campaignManager/App';
import { App as FileExplorer } from '../fileExplorer/App';

import { CollapsibleWebviews } from '../../../src/components/webview/webviewEvents';
import { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import { vscode } from '../shared/utilities/vscode';

type Props = Readonly<{
	screenWidth: number | null;
}> &
	MainWebviewViewProps & { activeTabId: 'codemodRuns' };

const RESIZABLE_PANELS: {
	id: CollapsibleWebviews;
	title: string;
	Component: React.FC<Props>;
	commands?: any[];
	inlineStyle?: CSSProperties;
}[] = [
	{
		id: 'codemodRunsView',
		title: 'Results',
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
		title: 'Change Explorer',
		Component: FileExplorer,
	},
];

const CodemodRuns = (props: Props) => {
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

	const storage: PanelGroupStorage = {
		getItem: () => JSON.stringify(props.panelGroupSettings),
		setItem: (_, panelGroupSettings: string): void => {
			vscode.postMessage({
				kind: 'webview.main.setPanelGroupSettings',
				panelGroupSettings,
			});
		},
	};

	return (
		<div className="w-full h-full">
			<PanelGroup
				direction="vertical"
				storage={storage}
				autoSaveId="codemodRuns"
			>
				{RESIZABLE_PANELS.map(
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
									defaultSize={50}
									ref={(ref) => {
										if (ref) {
											panelRefs.current[id] = ref;
										}
									}}
									style={{
										overflowY: 'auto',
										overflowX: 'hidden',
										...inlineStyle,
									}}
								>
									<Component {...props} />
								</ResizablePanel>
							</>
						);
					},
				)}
			</PanelGroup>
		</div>
	);
};

export default CodemodRuns;
