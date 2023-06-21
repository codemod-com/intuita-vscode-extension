import platformPath from 'path';
import { Uri } from 'vscode';
import { CaseHash } from '../cases/types';
import { caseAdapter, jobAdapter, State } from '../data/slice';
import { Job, JobHash, JobKind, PersistedJob } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildHash, isNeitherNullNorUndefined } from '../utilities';

export const doesJobAddNewFile = (kind: Job['kind']): boolean => {
	return [
		JobKind.copyFile,
		JobKind.createFile,
		JobKind.moveAndRewriteFile,
		JobKind.moveFile,
	].includes(kind);
};

export type ExplorerNodeHashDigest = string & {
	__ExplorerNodeHashDigest: 'ExplorerNodeHashDigest';
};

export const buildRootNode = () =>
	({
		hashDigest: buildHash('ROOT') as ExplorerNodeHashDigest,
		kind: 'ROOT' as const,
		label: '',
	} as const);

export const buildTopNode = (label: string) =>
	({
		hashDigest: buildHash('TOP') as ExplorerNodeHashDigest,
		kind: 'TOP' as const,
		label,
	} as const);

export const buildDirectoryNode = (path: string, label: string) =>
	({
		hashDigest: buildHash(
			['DIRECTORY', path, label].join(''),
		) as ExplorerNodeHashDigest,
		kind: 'DIRECTORY' as const,
		label,
	} as const);

export const buildFileNode = (job: PersistedJob, label: string) => {
	const fileAdded = doesJobAddNewFile(job.kind);

	return {
		kind: 'FILE' as const,
		hashDigest: buildHash(
			['FILE', job.hash, label].join(''),
		) as ExplorerNodeHashDigest,
		label,
		jobHash: job.hash,
		fileAdded,
	} as const;
};

export type ExplorerNode =
	| ReturnType<typeof buildRootNode>
	| ReturnType<typeof buildTopNode>
	| ReturnType<typeof buildDirectoryNode>
	| ReturnType<typeof buildFileNode>;

const getJobUri = (job: PersistedJob): Uri | null => {
	if (doesJobAddNewFile(job.kind) && job.newUri !== null) {
		return Uri.parse(job.newUri);
	}

	if (!doesJobAddNewFile(job.kind) && job.oldUri !== null) {
		return Uri.parse(job.oldUri);
	}

	return null;
};

export type NodeDatum = Readonly<{
	node: ExplorerNode;
	depth: number;
	expanded: boolean;
	focused: boolean;
	childCount: number;
}>;

export const selectExplorerTree = (state: State, rootPath: Uri | null) => {
	if (rootPath === null) {
		return null;
	}

	const caseHash = state.codemodRunsView.selectedCaseHash as CaseHash | null;

	if (caseHash === null) {
		return null;
	}

	const kase =
		caseAdapter.getSelectors().selectById(state.case, caseHash) ?? null;

	if (kase === null) {
		return null;
	}

	const properSearchPhrase = state.changeExplorerView.searchPhrase
		.trim()
		.toLocaleLowerCase();

	const nodes: Record<ExplorerNodeHashDigest, ExplorerNode> = {};
	const children: Record<
		ExplorerNodeHashDigest,
		Set<ExplorerNodeHashDigest>
	> = {};

	const caseJobManager = new LeftRightHashSetManager<CaseHash, JobHash>(
		new Set(state.caseHashJobHashes),
	);

	// rootNode
	const rootNode = buildRootNode();
	nodes[rootNode.hashDigest] = rootNode;
	children[rootNode.hashDigest] = new Set();

	// topNode
	const topPath = platformPath.basename(rootPath.fsPath);
	const topNode = buildTopNode(topPath);

	if (properSearchPhrase === '') {
		children[rootNode.hashDigest]?.add(topNode.hashDigest);
		nodes[topNode.hashDigest] = topNode;

		children[topNode.hashDigest] = new Set();
	}

	const jobs = Array.from(caseJobManager.getRightHashesByLeftHash(kase.hash))
		.map((jobHash) => {
			return (
				jobAdapter.getSelectors().selectById(state.job, jobHash) ?? null
			);
		})
		.filter(isNeitherNullNorUndefined)
		.filter((job) => {
			if (properSearchPhrase === '') {
				return true;
			}

			const jobUri = getJobUri(job);

			if (jobUri === null) {
				return false;
			}

			return jobUri.fsPath
				.toLocaleLowerCase()
				.includes(properSearchPhrase);
		})
		.sort((a, b) => {
			const aUri = getJobUri(a);
			const bUri = getJobUri(b);

			if (aUri === null || bUri === null) {
				return 0;
			}

			return aUri.fsPath.localeCompare(bUri.fsPath);
		});

	for (const job of jobs) {
		const uri = getJobUri(job);

		if (uri === null) {
			continue;
		}

		const path = uri.fsPath.replace(rootPath.fsPath, '');

		if (properSearchPhrase !== '') {
			const node = buildFileNode(job, path);
			children[rootNode.hashDigest]?.add(node.hashDigest);

			nodes[node.hashDigest] = node;
			children[node.hashDigest] = new Set();
		} else {
			path.split(platformPath.sep)
				.filter((name) => name !== '')
				.map((name, i, names) => {
					if (names.length - 1 === i) {
						return buildFileNode(job, name);
					}

					return buildDirectoryNode(
						names.slice(0, i + 1).join(platformPath.sep),
						name,
					);
				})
				.forEach((node, i, pathNodes) => {
					const parentNodeHash =
						i === 0
							? topNode.hashDigest
							: pathNodes[i - 1]?.hashDigest ??
							  topNode.hashDigest;

					children[parentNodeHash]?.add(node.hashDigest);

					nodes[node.hashDigest] = node;
					children[node.hashDigest] =
						children[node.hashDigest] ?? new Set();
				});
		}
	}

	const nodeData: NodeDatum[] = [];

	const appendNodeData = (
		hashDigest: ExplorerNodeHashDigest,
		depth: number,
	) => {
		const node = nodes[hashDigest] ?? null;

		if (node === null) {
			return;
		}

		const expanded =
			state.changeExplorerView.openedFileExplorerNodeIds.includes(
				hashDigest,
			);
		const focused =
			state.changeExplorerView.focusedFileExplorerNodeId === hashDigest;
		const childSet = children[node.hashDigest] ?? new Set();

		if (depth !== -1) {
			nodeData.push({
				node,
				depth,
				expanded,
				focused,
				childCount: childSet.size,
			});
		}

		if (!expanded && depth !== -1) {
			return;
		}

		for (const child of childSet) {
			appendNodeData(child, depth + 1);
		}
	};

	appendNodeData(rootNode.hashDigest, -1);

	return {
		nodeData,
		selectedNodeHashDigest: state.changeExplorerView
			.focusedFileExplorerNodeId as ExplorerNodeHashDigest | null,
		expandedNodeHashDigests: state.changeExplorerView
			.openedFileExplorerNodeIds as ExplorerNodeHashDigest[],
		appliedJobHashes: state.appliedJobHashes,
		searchPhrase: properSearchPhrase,
	};
};

export type ExplorerTree = NonNullable<ReturnType<typeof selectExplorerTree>>;
