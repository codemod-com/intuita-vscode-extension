import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';

import { CodemodEntry } from '../codemods/types';
import { ExecutionError } from '../errors/types';
import {
	CollapsibleWebviews,
	JobHash,
} from '../components/webview/webviewEvents';
import { Case, CaseHash } from '../cases/types';
import { PersistedJob } from '../jobs/types';
import { RootState, TabKind } from '../persistedState/codecs';
import { ExplorerNodeHashDigest } from '../selectors/selectExplorerTree';

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
			selectedCaseHash: null,
			visible: true,
		},
		codemodDiscoveryView: {
			executionPaths: {},
			focusedCodemodHashDigest: null,
			openedCodemodHashDigests: [],
			visible: true,
		},
		changeExplorerView: {
			focusedFileExplorerNodeId: null,
			collapsedNodeHashDigests: [],
			visible: false,
			searchPhrase: '',
		},
		communityView: {
			visible: true,
		},
		appliedJobHashes: [],
		codemodExecutionInProgress: false,
		activeTabId: TabKind.codemods,
	};
};

const rootSlice = createSlice({
	name: SLICE_KEY,
	initialState: getInitialState(),
	reducers: {
		setVisible(
			state,
			action: PayloadAction<{
				visible: boolean;
				viewName: CollapsibleWebviews;
			}>,
		) {
			const { visible, viewName } = action.payload;
			state[viewName].visible = visible;
		},
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
			state.changeExplorerView.collapsedNodeHashDigests = [];
			state.changeExplorerView.searchPhrase = '';
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
		setSelectedCaseHash(state, action: PayloadAction<string | null>) {
			state.codemodRunsView.selectedCaseHash = action.payload;
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
			action: PayloadAction<string | null>,
		) {
			state.codemodDiscoveryView.visible = true;
			state.codemodDiscoveryView.focusedCodemodHashDigest =
				action.payload;
		},
		setOpenedCodemodHashDigests(
			state,
			action: PayloadAction<ReadonlyArray<string>>,
		) {
			state.codemodDiscoveryView.visible = true;
			state.codemodDiscoveryView.openedCodemodHashDigests =
				action.payload.slice();
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
			action: PayloadAction<ExplorerNodeHashDigest | null>,
		) {
			state.changeExplorerView.visible = true;
			state.changeExplorerView.focusedFileExplorerNodeId = action.payload;
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
		setChangeExplorerVisible(state, action: PayloadAction<boolean>) {
			state.changeExplorerView.visible = action.payload;
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
	},
});

const actions = rootSlice.actions;

export { actions, SLICE_KEY };

export default rootSlice.reducer;
