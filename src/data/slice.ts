import platformPath from 'path';
import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';
import { go } from 'fuzzysort';

import { CodemodEntry } from '../codemods/types';
import { ExecutionError } from '../errors/types';
import { JobHash } from '../components/webview/webviewEvents';
import { Case, CaseHash } from '../cases/types';
import { PersistedJob } from '../jobs/types';
import { ActiveTabId, RootState } from '../persistedState/codecs';
import {
	selectNodeData,
	selectSearchPhrase,
} from '../selectors/selectExplorerTree';
import { CodemodNodeHashDigest } from '../selectors/selectCodemodTree';
import {
	_ExplorerNode,
	_ExplorerNodeHashDigest,
} from '../persistedState/explorerNodeCodec';
import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import {
	comparePersistedJobs,
	doesJobAddNewFile,
	getPersistedJobUri,
} from '../selectors/comparePersistedJobs';

const SLICE_KEY = 'root';

export const codemodAdapter = createEntityAdapter<CodemodEntry>({
	selectId: (codemod) => codemod.hashDigest,
});

export const caseAdapter = createEntityAdapter<Case>({
	selectId: (kase) => kase.hash,
});

export const jobAdapter = createEntityAdapter<PersistedJob>({
	selectId: (job) => job.hash,
});

export const getInitialState = (): RootState => {
	return {
		codemod: codemodAdapter.getInitialState(),
		case: caseAdapter.getInitialState(),
		job: jobAdapter.getInitialState(),
		lastCodemodHashDigests: [],
		executionErrors: {},
		caseHashJobHashes: [],
		codemodRunsView: {
			collapsed: false,
			selectedCaseHash: null,
			panelGroup: null,
		},
		codemodDiscoveryView: {
			executionPaths: {},
			focusedCodemodHashDigest: null,
			collapsedCodemodHashDigests: [],
			searchPhrase: '',
		},
		changeExplorerView: {
			collapsed: false,
		},
		jobDiffView: {
			visible: false,
		},
		codemodExecutionInProgress: false,
		activeTabId: 'codemods',
		explorerSearchPhrases: {},
		explorerNodes: {},
		selectedExplorerNodes: {},
		collapsedExplorerNodes: {},
		focusedExplorerNodes: {},
	};
};

const FUZZY_SEARCH_MINIMUM_SCORE = -1000;

const rootSlice = createSlice({
	name: SLICE_KEY,
	initialState: getInitialState(),
	reducers: {
		upsertCase(
			state,
			action: PayloadAction<[Case, ReadonlyArray<string>]>,
		) {
			const [kase, caseHashJobHashes] = action.payload;

			caseAdapter.upsertOne(state.case, kase);

			const set = new Set([
				...state.caseHashJobHashes,
				...caseHashJobHashes,
			]);

			state.caseHashJobHashes = Array.from(set);
		},
		removeCases(state, action: PayloadAction<ReadonlyArray<CaseHash>>) {
			caseAdapter.removeMany(state.case, action.payload);

			state.caseHashJobHashes = state.caseHashJobHashes.filter(
				(caseHashJobHash) =>
					action.payload.every(
						(caseHash) => !caseHashJobHash.startsWith(caseHash),
					),
			);

			for (const caseHash of action.payload) {
				state.executionErrors[caseHash] = [];

				if (state.codemodRunsView.selectedCaseHash === caseHash) {
					state.codemodRunsView.selectedCaseHash = null;
				}

				delete state.explorerSearchPhrases[caseHash];
				delete state.explorerNodes[caseHash];
				delete state.selectedExplorerNodes[caseHash];
				delete state.collapsedExplorerNodes[caseHash];
				delete state.focusedExplorerNodes[caseHash];
			}
		},
		upsertJobs(state, action: PayloadAction<ReadonlyArray<PersistedJob>>) {
			jobAdapter.upsertMany(state.job, action.payload);
		},
		clearState(state) {
			caseAdapter.removeAll(state.case);
			jobAdapter.removeAll(state.job);

			state.executionErrors = {};
			state.caseHashJobHashes = [];
			state.codemodRunsView.selectedCaseHash = null;

			state.explorerSearchPhrases = {};
			state.explorerNodes = {};
			state.selectedExplorerNodes = {};
			state.collapsedExplorerNodes = {};
			state.focusedExplorerNodes = {};
		},
		upsertCodemods(
			state,
			action: PayloadAction<ReadonlyArray<CodemodEntry>>,
		) {
			codemodAdapter.upsertMany(state.codemod, action.payload);
		},
		/**
		 * Codemod runs
		 */
		setSelectedCaseHash(state, action: PayloadAction<CaseHash | null>) {
			state.codemodRunsView.selectedCaseHash = action.payload;
			state.jobDiffView.visible = true;
		},
		/**
		 * Codemod list
		 */
		setExecutionPath(
			state,
			action: PayloadAction<{ codemodHash: string; path: string }>,
		) {
			const { codemodHash, path } = action.payload;
			state.codemodDiscoveryView.executionPaths[codemodHash] = path;
		},
		setRecentCodemodHashes(state, action: PayloadAction<string>) {
			state.lastCodemodHashDigests.push(action.payload);
		},
		setFocusedCodemodHashDigest(
			state,
			action: PayloadAction<CodemodNodeHashDigest | null>,
		) {
			state.activeTabId = 'codemods';
			state.codemodDiscoveryView.focusedCodemodHashDigest =
				action.payload;
			state.jobDiffView.visible = true;
		},
		flipCodemodHashDigest(
			state,
			action: PayloadAction<CodemodNodeHashDigest>,
		) {
			const set = new Set<CodemodNodeHashDigest>(
				state.codemodDiscoveryView.collapsedCodemodHashDigests,
			);

			if (set.has(action.payload)) {
				set.delete(action.payload);
			} else {
				set.add(action.payload);
			}

			state.codemodDiscoveryView.collapsedCodemodHashDigests =
				Array.from(set);
		},
		setCodemodSearchPhrase(state, action: PayloadAction<string>) {
			state.codemodDiscoveryView.searchPhrase = action.payload;
		},
		/**
		 * Errors
		 */
		setExecutionErrors(
			state,
			action: PayloadAction<{
				caseHash: string;
				errors: ReadonlyArray<ExecutionError>;
			}>,
		) {
			const { caseHash, errors } = action.payload;
			state.executionErrors[caseHash] = [...errors];
		},
		deleteJobs(state, action: PayloadAction<ReadonlyArray<JobHash>>) {
			jobAdapter.removeMany(state.job, action.payload);
		},
		setCodemodExecutionInProgress(state, action: PayloadAction<boolean>) {
			state.codemodExecutionInProgress = action.payload;
		},
		setChangeExplorerSearchPhrase(
			state,
			action: PayloadAction<[CaseHash, string]>,
		) {
			const [caseHash, searchPhrase] = action.payload;

			state.explorerSearchPhrases[caseHash] = searchPhrase;
		},
		setActiveTabId(state, action: PayloadAction<ActiveTabId>) {
			state.activeTabId = action.payload;
		},
		setPanelGroup(state, action: PayloadAction<string>) {
			state.codemodRunsView.panelGroup = action.payload;
		},
		focusExplorerNodeSibling(
			state,
			action: PayloadAction<[CaseHash, 'prev' | 'next']>,
		) {
			const [caseHash, direction] = action.payload;

			const prevNodeData = selectNodeData(state, caseHash);
			const focused = state.focusedExplorerNodes[caseHash] ?? null;

			const index = prevNodeData.findIndex((nodeDatum) => {
				return nodeDatum.node.hashDigest === focused;
			});

			if (index === -1) {
				return;
			}

			const nodeData = [
				// applies first the nodes after the found node
				...prevNodeData.slice(index + 1),
				// and the the nodes before the found node
				...prevNodeData.slice(0, index),
			];

			if (direction === 'prev') {
				// if we are looking for the previous file,
				// we can reverse the array (as if we were looking for the next file)
				nodeData.reverse();
			}

			const nodeDatum =
				nodeData.find((nodeDatum) => {
					return nodeDatum.node.kind === 'FILE';
				}) ?? null;

			if (nodeDatum === null || nodeDatum.node.kind !== 'FILE') {
				return;
			}

			state.focusedExplorerNodes[caseHash] = nodeDatum.node.hashDigest;
		},
		focusOnChangeExplorer(state) {
			state.activeTabId = 'codemodRuns';
			state.changeExplorerView.collapsed = false;
		},
		setExplorerNodes(state, action: PayloadAction<[CaseHash, string]>) {
			const [caseHash, rootPath] = action.payload;

			state.codemodExecutionInProgress = false;

			state.codemodRunsView.selectedCaseHash = caseHash;

			const kase = state.case.entities[caseHash] ?? null;

			if (kase === null) {
				return;
			}

			const nodes: Record<_ExplorerNodeHashDigest, _ExplorerNode> = {};

			// we can iterate through the sets based on the insertion order
			// that's why we can push hashes into the set coming from
			// the alphanumerical sorting of the job URIs and the iteration order
			// is maintained
			const children: Record<
				_ExplorerNodeHashDigest,
				Set<_ExplorerNodeHashDigest>
			> = {};

			const rootNode: _ExplorerNode = {
				kind: 'ROOT',
				hashDigest: buildHash('ROOT') as _ExplorerNodeHashDigest,
				label: platformPath.basename(rootPath),
				depth: 0,
			};

			nodes[rootNode.hashDigest] = rootNode;
			children[rootNode.hashDigest] = new Set();

			const caseJobManager = new LeftRightHashSetManager<
				CaseHash,
				JobHash
			>(new Set(state.caseHashJobHashes));

			const jobs = Array.from(
				caseJobManager.getRightHashesByLeftHash(kase.hash),
			)
				.map((jobHash) => state.job.entities[jobHash])
				.filter(isNeitherNullNorUndefined);

			if (jobs.length !== 0) {
				state.activeTabId = 'codemodRuns';
			}

			const filteredJobs = jobs.sort(comparePersistedJobs);

			const properSearchPhrase = selectSearchPhrase(state, caseHash);

			const allJobPaths = filteredJobs
				.map((j) => {
					const uri = getPersistedJobUri(j);

					return uri?.fsPath.toLocaleLowerCase() ?? null;
				})
				.filter(isNeitherNullNorUndefined);

			const searchResults = go(properSearchPhrase, allJobPaths)
				.filter((r) => r.score > FUZZY_SEARCH_MINIMUM_SCORE)
				.map((r) => r.target);

			for (const job of filteredJobs) {
				const uri = getPersistedJobUri(job);

				if (uri === null) {
					continue;
				}

				if (
					properSearchPhrase !== '' &&
					!searchResults.includes(uri.fsPath.toLocaleLowerCase())
				) {
					continue;
				}

				const path = uri.fsPath.replace(rootPath, '');

				path.split(platformPath.sep)
					.filter((name) => name !== '')
					.map((name, i, names) => {
						if (names.length - 1 === i) {
							return {
								kind: 'FILE' as const,
								hashDigest: buildHash(
									['FILE', job.hash, name].join(''),
								) as _ExplorerNodeHashDigest,
								path,
								label: name,
								depth: i + 1,
								jobHash: job.hash,
								fileAdded: doesJobAddNewFile(job.kind),
							};
						}

						const directoryPath = names
							.slice(0, i + 1)
							.join(platformPath.sep);

						return {
							kind: 'DIRECTORY' as const,
							path,
							hashDigest: buildHash(
								['DIRECTORY', directoryPath, name].join(''),
							) as _ExplorerNodeHashDigest,
							label: name,
							depth: i + 1,
						};
					})
					.forEach((node, i, pathNodes) => {
						const parentNodeHash =
							i === 0
								? rootNode.hashDigest
								: pathNodes[i - 1]?.hashDigest ??
								  rootNode.hashDigest;

						children[parentNodeHash]?.add(node.hashDigest);

						nodes[node.hashDigest] = node;
						children[node.hashDigest] =
							children[node.hashDigest] ?? new Set();
					});
			}

			const explorerNodes: _ExplorerNode[] = [];

			const appendExplorerNode = (
				hashDigest: _ExplorerNodeHashDigest,
			) => {
				const node = nodes[hashDigest] ?? null;

				if (node === null) {
					return;
				}

				explorerNodes.push(node);

				children[node.hashDigest]?.forEach((child) => {
					appendExplorerNode(child);
				});
			};

			appendExplorerNode(rootNode.hashDigest);

			const fileNodes = explorerNodes.filter<
				_ExplorerNode & { kind: 'FILE' }
			>(
				(node): node is _ExplorerNode & { kind: 'FILE' } =>
					node.kind === 'FILE',
			);

			const focusedExplorerNode = fileNodes[0]?.hashDigest ?? null;

			state.explorerNodes[caseHash] = explorerNodes;
			state.collapsedExplorerNodes[caseHash] = [];
			state.selectedExplorerNodes[caseHash] = explorerNodes.map(
				({ hashDigest }) => hashDigest,
			);

			if (focusedExplorerNode === null) {
				delete state.focusedExplorerNodes[caseHash];
			} else {
				state.focusedExplorerNodes[caseHash] = focusedExplorerNode;
			}
		},
		flipSelectedExplorerNode(
			state,
			action: PayloadAction<[CaseHash, _ExplorerNodeHashDigest]>,
		) {
			const [caseHash, explorerNodeHashDigest] = action.payload;

			const explorerNodes = state.explorerNodes[caseHash] ?? [];

			const index =
				explorerNodes.findIndex(
					(node) => node.hashDigest === explorerNodeHashDigest,
				) ?? -1;

			const explorerNode = explorerNodes[index] ?? null;

			if (explorerNode === null) {
				return;
			}

			const selectedHashDigests =
				state.selectedExplorerNodes[caseHash] ?? [];

			if (explorerNode.kind === 'FILE') {
				if (selectedHashDigests.includes(explorerNodeHashDigest)) {
					selectedHashDigests.splice(
						selectedHashDigests.indexOf(explorerNodeHashDigest),
						1,
					);
				} else {
					selectedHashDigests.push(explorerNodeHashDigest);
				}

				state.selectedExplorerNodes[caseHash] = selectedHashDigests;

				return;
			}

			// if a ROOT or a DIRECTORY is to be flipped, it means that
			// we are NOT projecting over a search phrase
			// otherwise directories would not be visible

			// get the root/directory and subordinate directory/files
			const hashDigests: _ExplorerNodeHashDigest[] = [
				explorerNodeHashDigest,
			];

			for (let i = index + 1; i < explorerNodes.length; i++) {
				const node = explorerNodes[i] ?? null;

				if (node === null || node.depth <= explorerNode.depth) {
					break;
				}

				hashDigests.push(node.hashDigest);
			}

			if (selectedHashDigests.includes(explorerNodeHashDigest)) {
				// deselect the directory and the files within it
				state.selectedExplorerNodes[caseHash] =
					selectedHashDigests.filter(
						(hashDigest) => !hashDigests.includes(hashDigest),
					);

				return;
			}

			// select the directory and the files within it
			state.selectedExplorerNodes[caseHash] = Array.from(
				new Set<_ExplorerNodeHashDigest>(
					selectedHashDigests.concat(hashDigests),
				),
			);
		},
		flipCollapsibleExplorerNode(
			state,
			action: PayloadAction<[CaseHash, _ExplorerNodeHashDigest]>,
		) {
			const [caseHashDigest, explorerNodeHashDigest] = action.payload;

			const collapsedExplorerNodes =
				state.collapsedExplorerNodes[caseHashDigest] ?? [];

			const index = collapsedExplorerNodes.findIndex(
				(hashDigest) => hashDigest === explorerNodeHashDigest,
			);

			if (index !== -1) {
				collapsedExplorerNodes.splice(index, 1);
			} else {
				collapsedExplorerNodes.push(explorerNodeHashDigest);
			}

			state.collapsedExplorerNodes[caseHashDigest] =
				collapsedExplorerNodes;
		},
		focusExplorerNode(
			state,
			action: PayloadAction<[CaseHash, _ExplorerNodeHashDigest]>,
		) {
			const [caseHash, explorerNodeHashDigest] = action.payload;

			state.focusedExplorerNodes[caseHash] = explorerNodeHashDigest;
			state.jobDiffView.visible = true;
		},
		setJobDiffViewVisible(state, action: PayloadAction<boolean>) {
			state.jobDiffView.visible = action.payload;
		},
	},
});

const actions = rootSlice.actions;

export { actions, SLICE_KEY };

export default rootSlice.reducer;
