import { ReactComponent as CaseIcon } from '../assets/case.svg';
import cn from 'classnames';
import { ReactNode } from 'react';
import TreeItem from '../shared/TreeItem';
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import {
	ExplorerNode,
	ExplorerNodeHashDigest,
	ExplorerTree,
} from '../../../src/selectors/selectExplorerTree';
import { JobHash } from '../shared/types';
import { NodeDatum } from '../intuitaTreeView';

const getIcon = (explorerNode: ExplorerNode, opened: boolean): ReactNode => {
	if (explorerNode.kind === 'TOP') {
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
	(explorerTree: ExplorerTree, onToggleJob: (jobHash: JobHash) => void) =>
	(props: {
		nodeDatum: NodeDatum<ExplorerNodeHashDigest, ExplorerNode>;
		onFlip: (hashDigest: ExplorerNodeHashDigest) => void;
		onFocus: (hashDigest: ExplorerNodeHashDigest) => void;
	}) => {
		const icon = getIcon(props.nodeDatum.node, props.nodeDatum.expanded);
		const focused = props.nodeDatum.focused;
		const hasChildren = props.nodeDatum.childCount > 0;

		const enableCheckbox = props.nodeDatum.node.kind === 'FILE';

		const Checkbox = () => {
			if (props.nodeDatum.node.kind !== 'FILE') {
				return null;
			}

			const { jobHash } = props.nodeDatum.node;

			const checked = explorerTree.appliedJobHashes.includes(jobHash);

			return (
				<VSCodeCheckbox
					onClick={(event) => {
						event.stopPropagation();
						onToggleJob(jobHash);
					}}
					checked={checked}
				/>
			);
		};

		return (
			<TreeItem
				key={props.nodeDatum.node.hashDigest}
				hasChildren={hasChildren}
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
				actionButtons={[enableCheckbox && <Checkbox />]}
				onPressChevron={(event) => {
					event.stopPropagation();

					props.onFlip(props.nodeDatum.node.hashDigest);
				}}
				inlineStyles={{
					root: {
						...(enableCheckbox && {
							...(!focused && {
								backgroundColor:
									'var(--vscode-list-hoverBackground)',
							}),
							paddingRight: 4,
						}),
					},
					actions: { display: 'flex' },
				}}
			/>
		);
	};
