import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';
import '../shared/util.css';
import { IntuitaTreeView } from '../intuitaTreeView';
import { CaseHash } from '../../../src/cases/types';
import { CodemodRunsTree } from '../../../src/selectors/selectCodemodRunsTree';
import { ReactComponent as CaseIcon } from '../assets/case.svg';
import TreeItem from '../shared/TreeItem';
import { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';

export const App = (
	props: MainWebviewViewProps & { activeTabId: 'codemodRuns' },
) => {
	if (props.codemodRunsTree.nodeData.length === 0) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via Codemod Discovery or
				VS Code Command & check back later!
			</p>
		);
	}

	return (
		<IntuitaTreeView<CaseHash, CodemodRunsTree['nodeData'][0]['node']>
			className="codemodRunsTreeView"
			focusedNodeHashDigest={props.codemodRunsTree.selectedNodeHashDigest}
			collapsedNodeHashDigests={[]}
			nodeData={props.codemodRunsTree.nodeData}
			nodeRenderer={(props) => {
				return (
					<TreeItem
						key={props.nodeDatum.node.hashDigest}
						hasChildren={props.nodeDatum.collapsable}
						id={props.nodeDatum.node.hashDigest}
						label={props.nodeDatum.node.label}
						subLabel=""
						icon={<CaseIcon />}
						depth={props.nodeDatum.depth}
						open={false}
						focused={props.nodeDatum.focused}
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
};
