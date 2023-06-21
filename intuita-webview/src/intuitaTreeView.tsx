import { useCallback, useRef } from 'react';
import { useKey } from './jobDiffView/hooks/useKey';

type TreeNode<HD extends string> = Readonly<{
	hashDigest: HD;
	label: string;
}>;

export type NodeDatum<HD extends string, TN extends TreeNode<HD>> = Readonly<{
	node: TN;
	depth: number;
	expanded: boolean;
	focused: boolean;
	childCount: number;
}>;

export type TreeViewProps<
	HD extends string,
	TN extends TreeNode<HD>,
> = Readonly<{
	selectedNodeHashDigest: HD | null;
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
		if (props.selectedNodeHashDigest === null) {
			return;
		}

		const index = props.nodeData.findIndex(
			(nodeDatum) =>
				nodeDatum.node.hashDigest === props.selectedNodeHashDigest,
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
		if (props.selectedNodeHashDigest === null) {
			return;
		}

		const index = props.nodeData.findIndex(
			(nodeDatum) =>
				nodeDatum.node.hashDigest === props.selectedNodeHashDigest,
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
		if (
			props.selectedNodeHashDigest === null ||
			props.collapsedNodeHashDigests.includes(
				props.selectedNodeHashDigest,
			)
		) {
			return;
		}

		props.onFlip(props.selectedNodeHashDigest);
	}, [props]);

	const arrowRightCallback = useCallback(() => {
		if (
			props.selectedNodeHashDigest === null ||
			!props.collapsedNodeHashDigests.includes(
				props.selectedNodeHashDigest,
			)
		) {
			return;
		}

		props.onFlip(props.selectedNodeHashDigest);
	}, [props]);

	useKey(ref.current, 'ArrowUp', arrowUpCallback);
	useKey(ref.current, 'ArrowDown', arrowDownCallback);
	useKey(ref.current, 'ArrowLeft', arrowLeftCallback);
	useKey(ref.current, 'ArrowRight', arrowRightCallback);

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
