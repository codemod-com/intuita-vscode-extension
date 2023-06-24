import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';

import { CodemodEntry } from '../codemods/types';
import { ExecutionError } from '../errors/types';
import { JobHash } from '../components/webview/webviewEvents';
import { Case, CaseHash } from '../cases/types';
import { PersistedJob } from '../jobs/types';
import { RootState, TabKind } from '../persistedState/codecs';
import {
	ExplorerNodeHashDigest,
	selectExplorerTree,
} from '../selectors/selectExplorerTree';
import { CodemodNodeHashDigest } from '../selectors/selectCodemodTree';
import { workspace } from 'vscode';

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
		},
		codemodDiscoveryView: {
			executionPaths: {},
			focusedCodemodHashDigest: null,
			collapsedCodemodHashDigests: [],
			searchPhrase: '',
		},
		changeExplorerView: {
			collapsed: false,
			focusedFileExplorerNodeId: null,
			focusedJobHash: null,
			collapsedNodeHashDigests: [],
			searchPhrase: '',
		},
		mainPanel: null,
		appliedJobHashes: [],
		codemodExecutionInProgress: false,
		activeTabId: TabKind.codemods,
	};
};

const rootSlice = createSlice({
	name: SLICE_KEY,
	initialState: getInitialState(),
	reducers: {
		setCases(state, action: PayloadAction<ReadonlyArray<Case>>) {
			caseAdapter.setAll(state.case, action.payload);
		},
		upsertCases(state, action: PayloadAction<ReadonlyArray<Case>>) {
			caseAdapter.upsertMany(state.case, action.payload);
		},
		removeCases(state, action: PayloadAction<ReadonlyArray<CaseHash>>) {
			caseAdapter.removeMany(state.case, action.payload);
		},
		upsertJobs(state, action: PayloadAction<ReadonlyArray<PersistedJob>>) {
			jobAdapter.upsertMany(state.job, action.payload);
		},
		clearState(state) {
			caseAdapter.removeAll(state.case);
			jobAdapter.removeAll(state.job);
			state.codemodRunsView.selectedCaseHash = null;
			state.caseHashJobHashes = [];
			state.changeExplorerView.focusedFileExplorerNodeId = null;
			state.changeExplorerView.focusedJobHash = null;
			state.changeExplorerView.collapsedNodeHashDigests = [];
			state.changeExplorerView.searchPhrase = '';
			state.mainPanel = null;
		},
		upsertCodemods(
			state,
			action: PayloadAction<ReadonlyArray<CodemodEntry>>,
		) {
			codemodAdapter.upsertMany(state.codemod, action.payload);
		},
		deleteCaseHashJobHashes(state) {
			state.caseHashJobHashes = [];
		},
		upsertCaseHashJobHashes(
			state,
			action: PayloadAction<ReadonlyArray<string>>,
		) {
			const set = new Set([
				...state.caseHashJobHashes,
				...action.payload,
			]);

			state.caseHashJobHashes = Array.from(set);
		},
		/**
		 * Codemod runs
		 */
		setSelectedCaseHash(state, action: PayloadAction<CaseHash | null>) {
			state.codemodRunsView.selectedCaseHash = action.payload;
			state.changeExplorerView.focusedFileExplorerNodeId = null;
			state.changeExplorerView.focusedJobHash = null;
			state.changeExplorerView.collapsedNodeHashDigests = [];
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
			state.codemodDiscoveryView.focusedCodemodHashDigest =
				action.payload;
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
		/**
		 * Change explorer
		 */
		setFocusedFileExplorerNodeId(
			state,
			action: PayloadAction<
				[ExplorerNodeHashDigest | null, JobHash | null]
			>,
		) {
			state.changeExplorerView.focusedFileExplorerNodeId =
				action.payload[0];
			state.changeExplorerView.focusedJobHash = action.payload[1];

			state.mainPanel = {
				focusedJobHash: action.payload[1],
				selectedCaseHash: state.codemodRunsView.selectedCaseHash,
			};
		},
		flipChangeExplorerHashDigests(
			state,
			action: PayloadAction<ExplorerNodeHashDigest>,
		) {
			const set = new Set<ExplorerNodeHashDigest>(
				state.changeExplorerView.collapsedNodeHashDigests,
			);

			if (set.has(action.payload)) {
				set.delete(action.payload);
			} else {
				set.add(action.payload);
			}

			state.changeExplorerView.collapsedNodeHashDigests = Array.from(set);
		},
		clearJobs(state) {
			jobAdapter.removeAll(state.job);
			state.appliedJobHashes = [];
		},
		upsertAppliedJobHashes(
			state,
			action: PayloadAction<ReadonlyArray<JobHash>>,
		) {
			state.appliedJobHashes = Array.from(
				new Set([...state.appliedJobHashes, ...action.payload]),
			);
		},
		setAppliedJobHashes(
			state,
			action: PayloadAction<ReadonlyArray<JobHash>>,
		) {
			state.appliedJobHashes = Array.from(
				new Set(action.payload.slice()),
			);
		},
		deleteJobs(state, action: PayloadAction<ReadonlyArray<JobHash>>) {
			jobAdapter.removeMany(state.job, action.payload);

			state.appliedJobHashes = state.appliedJobHashes.filter(
				(jobHash) => !action.payload.includes(jobHash as JobHash),
			);
		},
		setCodemodExecutionInProgress(state, action: PayloadAction<boolean>) {
			state.codemodExecutionInProgress = action.payload;
		},
		setChangeExplorerSearchPhrase(state, action: PayloadAction<string>) {
			state.changeExplorerView.searchPhrase = action.payload;
		},
		setActiveTabId(state, action: PayloadAction<TabKind>) {
			state.activeTabId = action.payload;
		},
		changeJob(state, action: PayloadAction<'prev' | 'next'>) {
			// this selector is expensive to calculate
			const changeExplorerTree = selectExplorerTree(
				state,
				workspace.workspaceFolders?.[0]?.uri ?? null,
			);

			if (changeExplorerTree === null) {
				return;
			}

			const index = changeExplorerTree.nodeData.findIndex((nodeDatum) => {
				return (
					nodeDatum.node.hashDigest ===
					changeExplorerTree.selectedNodeHashDigest
				);
			});

			if (index === -1) {
				return;
			}

			const nodeData = [
				// applies first the nodes after the found node
				...changeExplorerTree.nodeData.slice(index + 1),
				// and the the nodes before the found node

				...changeExplorerTree.nodeData.slice(0, index),
			];

			if (action.payload === 'prev') {
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

			state.changeExplorerView.focusedJobHash = nodeDatum.node.jobHash;

			state.mainPanel = {
				focusedJobHash: nodeDatum.node.jobHash,
				selectedCaseHash: state.codemodRunsView.selectedCaseHash,
			};

			state.changeExplorerView.focusedFileExplorerNodeId =
				nodeDatum.node.hashDigest;
		},
		focusOnChangeExplorer(state) {
			state.activeTabId = TabKind.codemodRuns;
			state.changeExplorerView.collapsed = false;
		},
		setPanelView(state, action: PayloadAction<RootState['mainPanel']>) {
			state.mainPanel = action.payload;
		},
	},
});

const actions = rootSlice.actions;

export { actions, SLICE_KEY };

export default rootSlice.reducer;
