import { ReactNode, useEffect, useRef } from 'react';
import cn from 'classnames';

import {
	CodemodNodeHashDigest,
	CodemodNode,
} from '../../../../src/selectors/selectCodemodTree';
import { NodeDatum } from '../../intuitaTreeView';

import Directory from './Directory';
import Codemod from './Codemod';

import styles from './style.module.css';

const getContainerInlineStyles = ({
	depth,
	node,
}: NodeDatum<CodemodNodeHashDigest, CodemodNode>) => {
	return {
		...(depth > 0 && {
			minWidth: `${5 + depth * 16}px`,
		}),
		...(node.kind === 'CODEMOD' && {
			minWidth: `${8 + (depth + 1) * 16}px`,
		}),
	};
};

type Deps = {
	rootPath: string;
	autocompleteItems: string[];
	progressBar: (node: CodemodNode) => JSX.Element | null;
	actionButtons: (
		node: CodemodNode,
	) => ReactNode;
};

type Props = Readonly<{
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>;
	onFlip: (hashDigest: CodemodNodeHashDigest) => void;
	onFocus: (hashDigest: CodemodNodeHashDigest) => void;
}>;

const getCodemodNodeRenderer =
	({ rootPath, autocompleteItems, progressBar, actionButtons }: Deps) =>
	({ nodeDatum, onFlip }: Props) => {
		const { node, focused, expanded } = nodeDatum;
		const { hashDigest, label } = node;

		const ref = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (!focused) {
				return;
			}

			const timeout = setTimeout(() => {
				ref.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				});
			}, 500);

			return () => {
				clearTimeout(timeout);
			};
		}, [focused]);

		return (
			<div
				id={hashDigest}
				tabIndex={0}
				ref={ref}
				className={cn(styles.root, focused && styles.focused)}
				onClick={() => onFlip(hashDigest)}
			>
				<div style={getContainerInlineStyles(nodeDatum)} />
				{node.kind === 'CODEMOD' ? (
					<Codemod
						nodeDatum={
							nodeDatum as NodeDatum<
								CodemodNodeHashDigest,
								CodemodNode & { kind: 'CODEMOD' }
							>
						}
						autocompleteItems={autocompleteItems}
						rootPath={rootPath}
						progressBar={progressBar}
						actionButtons={actionButtons}
					/>
				) : (
					<Directory expanded={expanded} label={label} />
				)}
			</div>
		);
	};

export { getCodemodNodeRenderer };
