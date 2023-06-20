import { CSSProperties, ReactElement, useEffect, useRef } from 'react';

import {
	PanelResizeHandle,
	ImperativePanelHandle,
} from 'react-resizable-panels';

import { ResizablePanel, PanelGroup } from '../shared/Panel';
import SectionHeader from '../shared/SectionHeader';
import { WebviewMessage } from '../shared/types';

import CampaignManager from '../campaignManager/App';
import FileExplorer from '../fileExplorer/App';

import { CollapsibleWebviews } from '../../../src/components/webview/webviewEvents';

type Props = {
	screenWidth: number | null;
};

const RESIZABLE_PANELS: {
	id: CollapsibleWebviews;
	title: string;
	Component: (props: any) => ReactElement | null;
	commands?: any[];
	inlineStyle?: CSSProperties;
}[] = [
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
		Component: (props) => CampaignManager(props),
	},
	{
		id: 'changeExplorerView',
		title: 'Changes Explorer',
		Component: (props) => FileExplorer(props),
	},
];

const CodemodRuns = ({ screenWidth }: Props) => {
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
		<div className="w-full h-full">
			<PanelGroup direction="vertical">
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
									<Component screenWidth={screenWidth} />
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
