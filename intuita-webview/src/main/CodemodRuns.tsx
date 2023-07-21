import {
	PanelResizeHandle,
	PanelGroupStorage,
	ImperativePanelHandle,
} from 'react-resizable-panels';

import { ResizablePanel, PanelGroup } from '../shared/Panel';
import { SectionHeader } from '../shared/SectionHeader';

import { App as CampaignManager } from '../campaignManager/App';
import { App as FileExplorer } from '../fileExplorer/App';

import { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import { vscode } from '../shared/utilities/vscode';
import { useEffect, useMemo, useRef } from 'react';

export const CodemodRuns = (
	props: MainWebviewViewProps & {
		activeTabId: 'codemodRuns';
		screenWidth: number | null;
	},
) => {
	const resultsRef = useRef<ImperativePanelHandle | null>(null);
	const changeExplorerRef = useRef<ImperativePanelHandle | null>(null);

	useEffect(() => {
		if (props.resultsCollapsed) {
			resultsRef.current?.collapse();
		} else {
			resultsRef.current?.expand();
		}

		if (props.changeExplorerCollapsed) {
			changeExplorerRef.current?.collapse();
		} else {
			changeExplorerRef.current?.expand();
		}
	}, [props.resultsCollapsed, props.changeExplorerCollapsed]);

	const storage = useMemo(
		(): PanelGroupStorage => ({
			getItem: () => JSON.stringify(props.panelGroupSettings),
			setItem: (_, panelGroupSettings: string): void => {
				vscode.postMessage({
					kind: 'webview.main.setCodemodRunsPanelGroupSettings',
					panelGroupSettings,
				});
			},
		}),
		[props.panelGroupSettings],
	);

	return (
		<div className="w-full h-full">
			<PanelGroup
				direction="vertical"
				storage={storage}
				autoSaveId="codemodRunsPanelGroup"
			>
				<SectionHeader
					title={'Results'}
					commands={[
						{
							icon: 'clear-all',
							title: 'Clear all',
							command: 'intuita.clearState',
						},
					]}
					collapsed={props.resultsCollapsed}
					onClick={(event) => {
						event.preventDefault();

						vscode.postMessage({
							kind: 'webview.global.collapseResultsPanel',
							collapsed: !props.resultsCollapsed,
						});
					}}
				/>
				<ResizablePanel
					collapsible
					minSize={0}
					defaultSize={props.panelGroupSettings['0,0']?.[0] ?? 50}
					style={{
						overflowY: 'auto',
						overflowX: 'hidden',
					}}
					ref={resultsRef}
					onCollapse={(collapsed) => {
						vscode.postMessage({
							kind: 'webview.global.collapseResultsPanel',
							collapsed,
						});
					}}
				>
					<CampaignManager {...props} />
				</ResizablePanel>
				<PanelResizeHandle className="resize-handle" />
				<SectionHeader
					title={'Change Explorer'}
					commands={[]}
					collapsed={props.changeExplorerCollapsed}
					onClick={(event) => {
						event.preventDefault();

						vscode.postMessage({
							kind: 'webview.global.collapseChangeExplorerPanel',
							collapsed: !props.changeExplorerCollapsed,
						});
					}}
				/>
				<ResizablePanel
					collapsible
					minSize={0}
					defaultSize={props.panelGroupSettings['0,0']?.[1] ?? 50}
					style={{
						overflowY: 'auto',
						overflowX: 'hidden',
					}}
					ref={changeExplorerRef}
					onCollapse={(collapsed) => {
						vscode.postMessage({
							kind: 'webview.global.collapseChangeExplorerPanel',
							collapsed,
						});
					}}
				>
					<FileExplorer {...props} />
				</ResizablePanel>
			</PanelGroup>
		</div>
	);
};
