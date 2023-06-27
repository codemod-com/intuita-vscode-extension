import { useEffect, useRef } from 'react';
import cn from 'classnames';

import {
	CodemodNodeHashDigest,
	CodemodNode,
} from '../../../../src/selectors/selectCodemodTree';
import { NodeDatum } from '../../intuitaTreeView';

import Directory from './Directory';
import Codemod from './Codemod';

import styles from './style.module.css';
import { ProgressType } from '../useProgressBar';
import { CodemodHash } from '../../shared/types';

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
	autocompleteItems: ReadonlyArray<string>;
	progress: ProgressType | null;
};

type Props = Readonly<{
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>;
	onFlip: (hashDigest: CodemodNodeHashDigest) => void;
	onFocus: (hashDigest: CodemodNodeHashDigest) => void;
}>;

const getCodemodNodeRenderer =
	({ rootPath, autocompleteItems, progress }: Deps) =>
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
				key={hashDigest}
				id={hashDigest}
				tabIndex={0}
				ref={ref}
				className={cn(styles.root, focused && styles.focused)}
				onClick={() => onFlip(hashDigest)}
			>
				<div style={getContainerInlineStyles(nodeDatum)} />
				{node.kind === 'CODEMOD' && (
					// <Profiler id="Codemod leaf" onRender={console.log}>
					<Codemod
						hashDigest={hashDigest}
						description={node.description}
						executionPath={node.executionPath}
						codemodKind={node.codemodKind}
						label={label}
						autocompleteItems={autocompleteItems}
						rootPath={rootPath}
						progress={
							progress?.codemodHash ===
							(node.hashDigest as unknown as CodemodHash)
								? progress.progress
								: null
						}
					/>
				)}

				{node.kind === 'DIRECTORY' && (
					// </Profiler>
					<Directory
						expanded={expanded}
						label={label}
						intuitaCertified={node.intuitaCertified}
					/>
				)}

				{node.kind === 'ROOT' && (
					<Directory
						expanded={expanded}
						label={label}
						intuitaCertified={false}
					/>
				)}
			</div>
		);
	};

export { getCodemodNodeRenderer };
