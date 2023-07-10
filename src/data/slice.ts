import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';

import * as vscode from 'vscode';

import { CodemodEntry } from '../codemods/types';
import { ExecutionError } from '../errors/types';
import { JobHash } from '../components/webview/webviewEvents';
import { Case, CaseHash } from '../cases/types';
import { PersistedJob } from '../jobs/types';
import {
	ActiveTabId,
	panelGroupSettingsCodec,
	RootState,
} from '../persistedState/codecs';
import {
	selectExplorerNodes,
	selectNodeData,
} from '../selectors/selectExplorerTree';
import { CodemodNodeHashDigest } from '../selectors/selectCodemodTree';
import { _ExplorerNodeHashDigest } from '../persistedState/explorerNodeCodec';
import { findParentExplorerNode } from '../utilities';

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
		codemodRunsTab: {
			resultsCollapsed: false,
			changeExplorerCollapsed: false,
			selectedCaseHash: null,
			panelGroupSettings: {
				'0,0': [50, 50],
			},
		},
		codemodDiscoveryView: {
			executionPaths: {},
			focusedCodemodHashDigest: null,
			collapsedCodemodHashDigests: [],
			searchPhrase: '',
		},
		jobDiffView: {
			visible: false,
		},
		caseHashInProgress: null,
		applySelectedInProgress: false,
		activeTabId: 'codemods',
		explorerSearchPhrases: {},
		selectedExplorerNodes: {},
		// indeterminate explorer node is a node some (but not all) of whose children are deselected.
		// For such node, we will use indeterminate checkbox icon.
		indeterminateExplorerNodes: {},
		collapsedExplorerNodes: {},
		focusedExplorerNodes: {},
	};
};

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

				if (state.codemodRunsTab.selectedCaseHash === caseHash) {
					state.codemodRunsTab.selectedCaseHash = null;
				}

				delete state.explorerSearchPhrases[caseHash];
				delete state.selectedExplorerNodes[caseHash];
				delete state.indeterminateExplorerNodes[caseHash];
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
			state.codemodRunsTab.selectedCaseHash = null;

			state.explorerSearchPhrases = {};
			state.selectedExplorerNodes = {};
			state.indeterminateExplorerNodes = {};
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
			state.codemodRunsTab.selectedCaseHash = action.payload;
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

			const caseHashJobHashes = state.caseHashJobHashes.filter(
				(caseHashJobHash) =>
					action.payload.every(
						(jobHash) => !caseHashJobHash.endsWith(jobHash),
					),
			);

			state.caseHashJobHashes = caseHashJobHashes;
		},
		setCaseHashInProgress(state, action: PayloadAction<CaseHash | null>) {
			state.caseHashInProgress = action.payload;
		},
		setApplySelectedInProgress(state, action: PayloadAction<boolean>) {
			state.applySelectedInProgress = action.payload;
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
		setPanelGroupSettings(state, action: PayloadAction<string>) {
			try {
				const validation = panelGroupSettingsCodec.decode(
					JSON.parse(action.payload),
				);

				if (validation._tag === 'Left') {
					throw new Error(
						'Could not decode the panel group settings',
					);
				}

				state.codemodRunsTab.panelGroupSettings = validation.right;
			} catch (error) {
				console.error(error);
			}
		},
		focusExplorerNodeSibling(
			state,
			action: PayloadAction<[CaseHash, 'prev' | 'next']>,
		) {
			const [caseHash, direction] = action.payload;
			const explorerNodes =
				selectExplorerNodes(
					state,
					caseHash,
					vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '',
				) ?? [];
			const prevNodeData = selectNodeData(state, caseHash, explorerNodes);
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
			state.codemodRunsTab.changeExplorerCollapsed = false;
		},
		setExplorerNodes(state, action: PayloadAction<[CaseHash, string]>) {
			const [caseHash, rootPath] = action.payload;

			state.applySelectedInProgress = false;

			state.codemodRunsTab.selectedCaseHash = caseHash;

			const explorerNodes =
				selectExplorerNodes(state, caseHash, rootPath) ?? [];

			const kase = state.case.entities[caseHash] ?? null;

			if (kase === null) {
				return;
			}

			if (explorerNodes.length !== 0) {
				state.activeTabId = 'codemodRuns';
			}

			const focusedExplorerNode = explorerNodes[0]?.hashDigest ?? null;

			state.collapsedExplorerNodes[caseHash] = [];
			state.indeterminateExplorerNodes[caseHash] = [];
			state.selectedExplorerNodes[caseHash] = explorerNodes.map(
				(node) => node.hashDigest,
			);

			if (focusedExplorerNode === null) {
				delete state.focusedExplorerNodes[caseHash];
			} else {
				state.focusedExplorerNodes[caseHash] = focusedExplorerNode;
			}
		},
		clearSelectedExplorerNodes(state, action: PayloadAction<CaseHash>) {
			state.selectedExplorerNodes[action.payload] = [];
		},
		clearIndeterminateExplorerNodes(
			state,
			action: PayloadAction<CaseHash>,
		) {
			state.indeterminateExplorerNodes[action.payload] = [];
		},
		flipSelectedExplorerNode(
			state,
			action: PayloadAction<[CaseHash, _ExplorerNodeHashDigest]>,
		) {
			const [caseHash, explorerNodeHashDigest] = action.payload;

			const explorerNodes =
				selectExplorerNodes(
					state,
					caseHash,
					vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '',
				) ?? [];

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
			} else {
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

				const indeterminateHashDigests =
					state.indeterminateExplorerNodes[caseHash] ?? [];

				state.indeterminateExplorerNodes[caseHash] =
					indeterminateHashDigests.filter(
						(hashDigest) => !hashDigests.includes(hashDigest),
					);

				if (
					selectedHashDigests.includes(explorerNodeHashDigest) ||
					indeterminateHashDigests.includes(explorerNodeHashDigest)
				) {
					// deselect the directory and the files within it
					state.selectedExplorerNodes[caseHash] =
						selectedHashDigests.filter(
							(hashDigest) => !hashDigests.includes(hashDigest),
						);
				} else {
					// select the directory and the files within it
					state.selectedExplorerNodes[caseHash] = Array.from(
						new Set<_ExplorerNodeHashDigest>(
							selectedHashDigests.concat(hashDigests),
						),
					);
				}
			}

			let currIndex = index;

			while (currIndex > 0) {
				const updatedSelectedHashDigests =
					state.selectedExplorerNodes[caseHash] ?? [];
				const updatedIndeterminateHashDigests =
					state.indeterminateExplorerNodes[caseHash] ?? [];

				const currNode = explorerNodes[currIndex] ?? null;
				if (currNode === null) {
					return;
				}

				const parentNode = findParentExplorerNode(
					currIndex,
					explorerNodes,
				);

				if (parentNode === null) {
					return;
				}

				const parentHashDigest = parentNode.node.hashDigest;

				const childNodeHashDigests: _ExplorerNodeHashDigest[] = [];

				for (
					let i = parentNode.index + 1;
					i < explorerNodes.length;
					i++
				) {
					const node = explorerNodes[i] ?? null;

					if (node === null || node.depth < currNode.depth) {
						break;
					}

					if (node.depth === explorerNode.depth) {
						childNodeHashDigests.push(node.hashDigest);
					}
				}

				const allSelected = childNodeHashDigests.every((hashDigest) =>
					updatedSelectedHashDigests.includes(hashDigest),
				);
				const allDeselected = childNodeHashDigests.every(
					(hashDigest) =>
						!updatedSelectedHashDigests.includes(hashDigest),
				);

				if (allSelected) {
					state.selectedExplorerNodes[caseHash] = Array.from(
						new Set<_ExplorerNodeHashDigest>(
							updatedSelectedHashDigests.concat([
								parentHashDigest,
							]),
						),
					);
					state.indeterminateExplorerNodes[caseHash] =
						updatedIndeterminateHashDigests.filter(
							(hashDigest) => hashDigest !== parentHashDigest,
						);
				} else if (allDeselected) {
					state.selectedExplorerNodes[caseHash] =
						updatedSelectedHashDigests.filter(
							(hashDigest) => hashDigest !== parentHashDigest,
						);
					state.indeterminateExplorerNodes[caseHash] =
						updatedIndeterminateHashDigests.filter(
							(hashDigest) => hashDigest !== parentHashDigest,
						);
				} else {
					// case: some (but not all) child nodes are selected
					state.selectedExplorerNodes[caseHash] =
						updatedSelectedHashDigests.filter(
							(hashDigest) => hashDigest !== parentHashDigest,
						);

					state.indeterminateExplorerNodes[caseHash] = Array.from(
						new Set<_ExplorerNodeHashDigest>(
							updatedIndeterminateHashDigests.concat([
								parentNode.node.hashDigest,
							]),
						),
					);
				}

				currIndex = parentNode.index;
			}
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
		collapseResultsPanel(state, action: PayloadAction<boolean>) {
			state.codemodRunsTab.resultsCollapsed = action.payload;
		},
		collapseChangeExplorerPanel(state, action: PayloadAction<boolean>) {
			state.codemodRunsTab.changeExplorerCollapsed = action.payload;
		},
	},
});

const actions = rootSlice.actions;

export { actions, SLICE_KEY };

export default rootSlice.reducer;
