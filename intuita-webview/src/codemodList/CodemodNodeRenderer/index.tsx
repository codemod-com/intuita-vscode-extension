import { useEffect, useRef } from 'react';

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
import cn from 'classnames';

const getIndent = (depth: number) => {
	return depth * 17;
};

type Deps = {
	progress: Progress | null;
	screenWidth: number | null;
};

type Props = Readonly<{
	nodeDatum: NodeDatum<CodemodNodeHashDigest, CodemodNode>;
	onFlip: (hashDigest: CodemodNodeHashDigest) => void;
	onFocus: (hashDigest: CodemodNodeHashDigest) => void;
}>;

const getCodemodNodeRenderer =
	({ progress, screenWidth }: Deps) =>
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
			ref.current?.focus();
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
						minWidth: `${getIndent(nodeDatum.depth)}px`,
					}}
				/>
				{node.kind === 'CODEMOD' && (
					<Codemod
						hashDigest={hashDigest}
						label={label}
						progress={
							progress?.codemodHash ===
							(node.hashDigest as unknown as CodemodHash)
								? progress
								: null
						}
						isPrivate={node.isPrivate}
						focused={focused}
						queued={node.queued}
						icon={node.icon}
						screenWidth={screenWidth}
						permalink={node.permalink}
					/>
				)}

				{['DIRECTORY', 'ROOT'].includes(node.kind) ? (
					<Directory expanded={expanded} label={label} />
				) : null}
			</div>
		);
	};

export { getCodemodNodeRenderer };
