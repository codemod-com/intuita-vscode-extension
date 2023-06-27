import { ReactComponent as CaseIcon } from '../assets/case.svg';
import cn from 'classnames';
import { ReactNode } from 'react';
import TreeItem from '../shared/TreeItem';
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { ExplorerTree } from '../../../src/selectors/selectExplorerTree';
import { NodeDatum } from '../intuitaTreeView';
import {
	_ExplorerNode,
	_ExplorerNodeHashDigest,
} from '../../../src/persistedState/explorerNodeCodec';
import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';

const getIcon = (explorerNode: _ExplorerNode, opened: boolean): ReactNode => {
	if (explorerNode.kind === 'ROOT') {
		return <CaseIcon />;
	}

	if (explorerNode.kind === 'DIRECTORY') {
		return (
			<span
				className={cn(
					'codicon',
					!opened ? 'codicon-folder' : 'codicon-folder-opened',
				)}
			/>
		);
	}

	if (explorerNode.kind === 'FILE') {
		return (
			<span
				className={cn('codicon', {
					'codicon-file-add': explorerNode.fileAdded,
					'codicon-file': !explorerNode.fileAdded,
				})}
			/>
		);
	}

	return null;
};

export const explorerNodeRenderer =
	(explorerTree: ExplorerTree) =>
	(props: {
		nodeDatum: NodeDatum<_ExplorerNodeHashDigest, _ExplorerNode>;
		onFlip: (hashDigest: _ExplorerNodeHashDigest) => void;
		onFocus: (hashDigest: _ExplorerNodeHashDigest) => void;
	}) => {
		const icon = getIcon(props.nodeDatum.node, props.nodeDatum.expanded);
		const focused = props.nodeDatum.focused;

		const Checkbox = () => {
			const explorerNodeHashDigest = props.nodeDatum.node.hashDigest;

			const checked =
				explorerTree.selectedExplorerNodeHashDigests.includes(
					explorerNodeHashDigest,
				);

			return (
				<VSCodeCheckbox
					onClick={(event) => {
						event.stopPropagation();

						vscode.postMessage({
							kind: 'webview.global.flipSelectedExplorerNode',
							caseHashDigest: explorerTree.caseHash,
							explorerNodeHashDigest,
						});
					}}
					checked={checked}
					className={styles.checkbox}
				/>
			);
		};

		return (
			<TreeItem
				key={props.nodeDatum.node.hashDigest}
				hasChildren={props.nodeDatum.collapsable}
				id={props.nodeDatum.node.hashDigest}
				label={props.nodeDatum.node.label}
				subLabel=""
				icon={icon}
				depth={props.nodeDatum.depth}
				open={props.nodeDatum.expanded}
				focused={focused}
				onClick={(event) => {
					event.stopPropagation();

					props.onFocus(props.nodeDatum.node.hashDigest);
				}}
				startDecorator={<Checkbox />}
				onPressChevron={(event) => {
					event.stopPropagation();

					props.onFlip(props.nodeDatum.node.hashDigest);
				}}
				inlineStyles={{
					root: {
						...(!focused && {
							backgroundColor:
								'var(--vscode-list-hoverBackground)',
						}),
						paddingRight: 4,
					},
				}}
			/>
		);
	};
