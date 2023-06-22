import platformPath from 'path';
import * as t from 'io-ts';
import { Uri } from 'vscode';
import { CaseHash } from '../cases/types';
import { RootState } from '../data';
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

interface ExplorerNodeHashDigestBrand {
	readonly __ExplorerNodeHashDigest: unique symbol;
}

export const explorerNodeHashDigestCodec = t.brand(
	t.string,
	(
		hashDigest,
	): hashDigest is t.Branded<string, ExplorerNodeHashDigestBrand> =>
		hashDigest.length > 0,
	'__ExplorerNodeHashDigest',
);

export type ExplorerNodeHashDigest = t.TypeOf<
	typeof explorerNodeHashDigestCodec
>;

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
		path,
		label,
	} as const);

export const buildFileNode = (
	job: PersistedJob,
	label: string,
	path: string,
) => {
	const fileAdded = doesJobAddNewFile(job.kind);

	return {
		kind: 'FILE' as const,
		hashDigest: buildHash(
			['FILE', job.hash, label].join(''),
		) as ExplorerNodeHashDigest,
		label,
		path,
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

export const selectExplorerTree = (state: RootState, rootPath: Uri | null) => {
	if (rootPath === null || state.codemodExecutionInProgress) {
		return null;
	}

	const caseHash = state.codemodRunsView.selectedCaseHash as CaseHash | null;

	if (caseHash === null) {
		return null;
	}

	const kase = state.case.entities[caseHash] ?? null;

	if (kase === null) {
		return null;
	}

	const properSearchPhrase = state.changeExplorerView.searchPhrase
		.trim()
		.toLocaleLowerCase();

	const nodes: Record<ExplorerNodeHashDigest, ExplorerNode> = {};

	// we can iterate through the sets based on the insertion order
	// that's why we can push hashes into the set coming from
	// the alphanumerical sorting of the job URIs and the iteration order
	// is maintained
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
		.map((jobHash) => state.job.entities[jobHash])
		.filter(isNeitherNullNorUndefined);

	const jobHashes = jobs.map(({ hash }) => hash);

	const filteredJobs = jobs
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

	for (const job of filteredJobs) {
		const uri = getJobUri(job);

		if (uri === null) {
			continue;
		}

		const path = uri.fsPath.replace(rootPath.fsPath, '');

		if (properSearchPhrase !== '') {
			const node = buildFileNode(job, path, path);
			children[rootNode.hashDigest]?.add(node.hashDigest);

			nodes[node.hashDigest] = node;
			children[node.hashDigest] = new Set();
		} else {
			path.split(platformPath.sep)
				.filter((name) => name !== '')
				.map((name, i, names) => {
					if (names.length - 1 === i) {
						return buildFileNode(job, name, path);
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
			!state.changeExplorerView.collapsedNodeHashDigests.includes(
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
		caseHash,
		nodeData,
		selectedNodeHashDigest:
			state.changeExplorerView.focusedFileExplorerNodeId,
		collapsedNodeHashDigests:
			state.changeExplorerView.collapsedNodeHashDigests,
		deselectedChangeExplorerNodeHashDigests:
			state.deselectedChangeExplorerNodeHashDigests,
		searchPhrase: properSearchPhrase,
		jobHashes,
	};
};

export type ExplorerTree = NonNullable<ReturnType<typeof selectExplorerTree>>;
