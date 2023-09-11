import { vscode } from '../../shared/utilities/vscode';

import { useProgressBar } from '../useProgressBar';

import {
	CodemodNode,
	CodemodNodeHashDigest,
	CodemodTree,
} from '../../../../src/selectors/selectCodemodTree';

import { IntuitaTreeView } from '../../intuitaTreeView';
import { getCodemodNodeRenderer } from '../CodemodNodeRenderer';

type Props = Readonly<{
	tree: CodemodTree;
	screenWidth: number | null;
}>;

const onFocus = (hashDigest: CodemodNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.selectCodemodNodeHashDigest',
		selectedCodemodNodeHashDigest: hashDigest,
	});
};

const onFlip = (hashDigest: CodemodNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.flipCodemodHashDigest',
		codemodNodeHashDigest: hashDigest,
	});

	onFocus(hashDigest);
};

const TreeView = ({
	tree,
	screenWidth,
}: Props) => {
	const progress = useProgressBar();

	return (
		<IntuitaTreeView<CodemodNodeHashDigest, CodemodNode>
			{...tree}
			nodeRenderer={getCodemodNodeRenderer({
				progress,
				screenWidth,
			})}
			onFlip={onFlip}
			onFocus={onFocus}
		/>
	);
};

export default TreeView;
