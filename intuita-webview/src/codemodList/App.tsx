import areEqual from 'fast-deep-equal';
import { memo, useEffect, useMemo, useRef } from 'react';

import {
	PanelResizeHandle,
	PanelGroupStorage,
	ImperativePanelHandle,
} from 'react-resizable-panels';
import { ResizablePanel, PanelGroup } from '../shared/Panel';

import { vscode } from '../shared/utilities/vscode';
import SearchBar from '../shared/SearchBar';

import TreeView from './TreeView';

import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import cn from 'classnames';
import { SectionHeader } from '../shared/SectionHeader';

const setSearchPhrase = (searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setCodemodSearchPhrase',
		searchPhrase,
	});
};

export const App = memo(
	(
		props: MainWebviewViewProps & {
			activeTabId: 'codemods';
			screenWidth: number | null;
		},
	) => {
		const publicRegistryRef = useRef<ImperativePanelHandle | null>(null);
		const privateRegistryRef = useRef<ImperativePanelHandle | null>(null);

		useEffect(() => {
			if (props.publicRegistryCollapsed) {
				publicRegistryRef.current?.collapse();
			} else {
				publicRegistryRef.current?.expand();
			}

			if (props.privateRegistryCollapsed) {
				privateRegistryRef.current?.collapse();
			} else {
				privateRegistryRef.current?.expand();
			}
		}, [props.publicRegistryCollapsed, props.privateRegistryCollapsed]);

		const storage = useMemo(
			(): PanelGroupStorage => ({
				getItem: () => JSON.stringify(props.panelGroupSettings),
				setItem: (_, panelGroupSettings: string): void => {
					vscode.postMessage({
						kind: 'webview.main.setCodemodDiscoveryPanelGroupSettings',
						panelGroupSettings,
					});
				},
			}),
			[props.panelGroupSettings],
		);

		return (
			<>
				<main className={cn('w-full', 'h-full', 'overflow-y-auto')}>
					<PanelGroup
						direction="vertical"
						storage={storage}
						autoSaveId="codemodListPanelGroup"
					>
						<SectionHeader
							title={'Public Registry'}
							commands={[]}
							collapsed={props.publicRegistryCollapsed}
							onClick={(event) => {
								event.preventDefault();

								vscode.postMessage({
									kind: 'webview.global.collapsePublicRegistryPanel',
									collapsed: !props.publicRegistryCollapsed,
								});
							}}
						/>
						<ResizablePanel
							collapsible
							minSize={0}
							defaultSize={
								props.panelGroupSettings['0,0']?.[0] ?? 50
							}
							style={{
								overflowY: 'auto',
								overflowX: 'hidden',
							}}
							ref={publicRegistryRef}
							onCollapse={(collapsed) => {
								vscode.postMessage({
									kind: 'webview.global.collapsePublicRegistryPanel',
									collapsed,
								});
							}}
						>
							<SearchBar
								searchPhrase={props.searchPhrase}
								setSearchPhrase={setSearchPhrase}
								placeholder="Search public codemods..."
							/>
							<TreeView
								screenWidth={props.screenWidth}
								tree={props.codemodTree}
								rootPath={props.rootPath}
								autocompleteItems={props.autocompleteItems}
							/>
						</ResizablePanel>
						<PanelResizeHandle className="resize-handle" />
						<SectionHeader
							title={'Private Registry'}
							commands={[
								{
									icon: 'clear-all',
									title: 'Clear all',
									command: 'intuita.clearPrivateCodemods',
								},
							]}
							collapsed={props.privateRegistryCollapsed}
							onClick={(event) => {
								event.preventDefault();

								vscode.postMessage({
									kind: 'webview.global.collapsePrivateRegistryPanel',
									collapsed: !props.privateRegistryCollapsed,
								});
							}}
							style={{
								backgroundColor:
									'var(--vscode-tab-inactiveBackground)',
							}}
						/>
						<ResizablePanel
							collapsible
							minSize={0}
							defaultSize={
								props.panelGroupSettings['0,0']?.[1] ?? 50
							}
							style={{
								overflowY: 'auto',
								overflowX: 'hidden',
								backgroundColor:
									'var(--vscode-tab-inactiveBackground)',
							}}
							ref={privateRegistryRef}
							onCollapse={(collapsed) => {
								vscode.postMessage({
									kind: 'webview.global.collapsePrivateRegistryPanel',
									collapsed,
								});
							}}
						>
							<TreeView
								screenWidth={props.screenWidth}
								tree={props.privateCodemods}
								rootPath={props.rootPath}
								autocompleteItems={props.autocompleteItems}
							/>
						</ResizablePanel>
					</PanelGroup>
				</main>
			</>
		);
	},
	areEqual,
);
