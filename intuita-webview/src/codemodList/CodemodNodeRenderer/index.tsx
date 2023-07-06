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
import { Progress } from '../useProgressBar';
import { CodemodHash } from '../../shared/types';

const getIndent = (depth: number, kind: CodemodNode['kind']) => {
	return kind === 'CODEMOD' ? 8 + (depth + 1) * 16 : 5 + depth * 16;
};

type Deps = {
	rootPath: string;
	autocompleteItems: ReadonlyArray<string>;
	progress: Progress | null;
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

			ref.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
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
				<div
					style={{
						minWidth: `${getIndent(
							nodeDatum.depth,
							nodeDatum.node.kind,
						)}px`,
					}}
				/>
				{node.kind === 'CODEMOD' && (
					<Codemod
						hashDigest={hashDigest}
						executionPath={node.executionPath}
						label={label}
						autocompleteItems={autocompleteItems}
						rootPath={rootPath}
						progress={
							progress?.codemodHash ===
							(node.hashDigest as unknown as CodemodHash)
								? progress
								: null
						}
						queued={node.queued}
						intuitaCertified={node.intuitaCertified}
					/>
				)}

				{node.kind === 'DIRECTORY' && (
					<Directory expanded={expanded} label={label} />
				)}

				{node.kind === 'ROOT' && (
					<Directory expanded={expanded} label={label} />
				)}
			</div>
		);
	};

export { getCodemodNodeRenderer };
