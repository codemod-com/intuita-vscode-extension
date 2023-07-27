import { useCallback, useRef } from 'react';
import { useKey } from './jobDiffView/hooks/useKey';
import { CodemodNodeHashDigest } from '../../src/selectors/selectCodemodTree';

const getCodemodActionButtons = (
	hashDigest: CodemodNodeHashDigest,
): [HTMLElement | null, HTMLElement | null, HTMLElement | null] => {
	const pathButton = document.getElementById(`${hashDigest}-pathButton`);
	const dryRunButton = document.getElementById(`${hashDigest}-dryRunButton`);
	const shareButton = document.getElementById(`${hashDigest}-shareButton`);
	return [pathButton, dryRunButton, shareButton];
};

type TreeNode<HD extends string> = Readonly<{
	hashDigest: HD;
	label: string;
}>;

export type NodeDatum<HD extends string, TN extends TreeNode<HD>> = Readonly<{
	node: TN;
	depth: number;
	expanded: boolean;
	focused: boolean;
	collapsable: boolean;
	reviewed: boolean;
}>;

export type TreeViewProps<
	HD extends string,
	TN extends TreeNode<HD>,
> = Readonly<{
	focusedNodeHashDigest: HD | null;
	collapsedNodeHashDigests: ReadonlyArray<HD>;
	nodeData: ReadonlyArray<NodeDatum<HD, TN>>;
	nodeRenderer: (
		props: Readonly<{
			nodeDatum: NodeDatum<HD, TN>;
			onFlip: (hashDigest: HD) => void;
			onFocus: (hashDigest: HD) => void;
		}>,
	) => JSX.Element;
	onFlip: (hashDigest: HD) => void;
	onFocus: (hashDigest: HD) => void;
}>;

export const IntuitaTreeView = <HD extends string, TN extends TreeNode<HD>>(
	props: TreeViewProps<HD, TN>,
) => {
	const ref = useRef<HTMLDivElement>(null);

	const arrowUpCallback = useCallback(() => {
		if (props.focusedNodeHashDigest === null) {
			return;
		}

		const index = props.nodeData.findIndex(
			(nodeDatum) =>
				nodeDatum.node.hashDigest === props.focusedNodeHashDigest,
		);

		if (index === -1) {
			return;
		}

		const newIndex = index === 0 ? props.nodeData.length - 1 : index - 1;

		const hashDigest = props.nodeData[newIndex]?.node.hashDigest ?? null;

		if (hashDigest === null) {
			return;
		}

		props.onFocus(hashDigest);
	}, [props]);

	const arrowDownCallback = useCallback(() => {
		if (props.focusedNodeHashDigest === null) {
			return;
		}

		const index = props.nodeData.findIndex(
			(nodeDatum) =>
				nodeDatum.node.hashDigest === props.focusedNodeHashDigest,
		);

		if (index === -1) {
			return;
		}

		const newIndex = index === props.nodeData.length - 1 ? 0 : index + 1;

		const hashDigest = props.nodeData[newIndex]?.node.hashDigest ?? null;

		if (hashDigest === null) {
			return;
		}

		props.onFocus(hashDigest);
	}, [props]);

	const arrowLeftCallback = useCallback(() => {
		if (props.focusedNodeHashDigest === null) {
			return;
		}

		// applicable to directories
		if (
			!props.collapsedNodeHashDigests.includes(
				props.focusedNodeHashDigest,
			)
		) {
			props.onFlip(props.focusedNodeHashDigest);
		}

		// applicable to codemods
		const activeElement = document.activeElement;
		if (activeElement === null) {
			return;
		}

		const [pathButton, dryRunButton, shareButton] = getCodemodActionButtons(
			props.focusedNodeHashDigest as unknown as CodemodNodeHashDigest,
		);

		if (dryRunButton !== null && activeElement.id === dryRunButton.id) {
			pathButton?.focus();
		}
		if (shareButton !== null && activeElement.id === shareButton.id) {
			dryRunButton?.focus();
		}
	}, [props]);

	const arrowRightCallback = useCallback(() => {
		if (props.focusedNodeHashDigest === null) {
			return;
		}

		// applicable to directories
		if (
			props.collapsedNodeHashDigests.includes(props.focusedNodeHashDigest)
		) {
			props.onFlip(props.focusedNodeHashDigest);
		}

		// applicable to codemods
		const activeElement = document.activeElement;
		if (activeElement === null) {
			return;
		}
		const [pathButton, dryRunButton, shareButton] = getCodemodActionButtons(
			props.focusedNodeHashDigest as unknown as CodemodNodeHashDigest,
		);

		if (pathButton !== null && activeElement.id === pathButton.id) {
			dryRunButton?.focus();
		}
		if (dryRunButton !== null && activeElement.id === dryRunButton.id) {
			shareButton?.focus();
		}
	}, [props]);

	const enterCallback = useCallback(() => {
		if (props.focusedNodeHashDigest === null) {
			return;
		}

		const [pathButton, dryRunButton, shareButton] = getCodemodActionButtons(
			props.focusedNodeHashDigest as unknown as CodemodNodeHashDigest,
		);

		const focusedActionButtonNode =
			[pathButton, dryRunButton, shareButton].find(
				(node) =>
					node !== null && document.activeElement?.id === node.id,
			) ?? null;

		if (focusedActionButtonNode !== null) {
			focusedActionButtonNode.click();
			return;
		}

		dryRunButton?.focus();
	}, [props]);

	useKey(ref.current, 'ArrowUp', arrowUpCallback);
	useKey(ref.current, 'ArrowDown', arrowDownCallback);
	useKey(ref.current, 'ArrowLeft', arrowLeftCallback);
	useKey(ref.current, 'ArrowRight', arrowRightCallback);
	useKey(ref.current, 'Enter', enterCallback);
	useKey(ref.current, 'Space', enterCallback);

	return (
		<div ref={ref}>
			{props.nodeData.map((nodeDatum) =>
				props.nodeRenderer({
					nodeDatum,
					onFlip: props.onFlip,
					onFocus: props.onFocus,
				}),
			)}
		</div>
	);
};
