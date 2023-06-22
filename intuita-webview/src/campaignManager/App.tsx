import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';
import '../shared/util.css';
import type { WebviewMessage } from '../../../src/components/webview/webviewEvents';
import { IntuitaTreeView } from '../intuitaTreeView';
import { CaseHash } from '../../../src/cases/types';
import { CodemodRunsTree } from '../../../src/selectors/selectCodemodRunsTree';
import { ReactComponent as CaseIcon } from '../assets/case.svg';
import TreeItem from '../shared/TreeItem';

type Props = { screenWidth: number | null };

function App({ screenWidth: _screenWidth }: Props) {
	const [viewProps, setViewProps] = useState(
		window.INITIAL_STATE.codemodRunsProps,
	);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.codemodRuns.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'campaignManagerView') {
					setViewProps(message.value.viewProps);
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (viewProps.nodeData.length === 0) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via Codemod Discovery or
				VS Code Command & check back later!
			</p>
		);
	}

	return (
		<IntuitaTreeView<CaseHash, CodemodRunsTree['nodeData'][0]['node']>
			selectedNodeHashDigest={viewProps.selectedNodeHashDigest}
			collapsedNodeHashDigests={[]}
			nodeData={viewProps.nodeData}
			nodeRenderer={(props) => {
				return (
					<TreeItem
						key={props.nodeDatum.node.hashDigest}
						hasChildren={props.nodeDatum.childCount !== 0}
						id={props.nodeDatum.node.hashDigest}
						label={props.nodeDatum.node.label}
						subLabel=""
						icon={<CaseIcon />}
						depth={props.nodeDatum.depth}
						open={false}
						focused={props.nodeDatum.focused}
						actionButtons={null}
						onClick={(event) => {
							event.stopPropagation();

							props.onFocus(props.nodeDatum.node.hashDigest);
						}}
					/>
				);
			}}
			onFlip={() => {}}
			onFocus={function (hashDigest: CaseHash): void {
				vscode.postMessage({
					kind: 'webview.campaignManager.setSelectedCaseHash',
					caseHash: hashDigest,
				});
			}}
		/>
	);
}

export default App;
