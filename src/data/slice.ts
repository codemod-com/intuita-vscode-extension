import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';

import { CodemodEntry } from '../codemods/types';
import { ExecutionError } from '../errors/types';
import { PersistedCase, PersistedJob } from '../persistedState/codecs';
import { CollapsibleWebviews } from '../components/webview/webviewEvents';

const SLICE_KEY = 'root';

type CodemodDiscoveryState = Readonly<{
	openedCodemodHashDigests: ReadonlyArray<string> | null;
	focusedCodemodHashDigest: string | null;
	executionPaths: Record<string, string>;
	visible: boolean;
}>;

type CodemodRunsState = Readonly<{
	selectedCaseHash: string | null;
	visible: boolean;
}>;

type ChangeExplorerState = Readonly<{
	visible: boolean;

	focusedFileExplorerNodeId: string | null;
	openedFileExplorerNodeIds: ReadonlyArray<string>;
}>;

type CommunityState = Readonly<{
	visible: boolean;
}>;

type State = {
	codemodDiscoveryView: CodemodDiscoveryState;
	codemodRunsView: CodemodRunsState;
	changeExplorerView: ChangeExplorerState;
	communityView: CommunityState;
	lastCodemodHashDigests: ReadonlyArray<string>;
	caseHashJobHashes: ReadonlyArray<string>;
	executionErrors: Record<string, ReadonlyArray<ExecutionError>>;
	codemod: ReturnType<typeof codemodAdapter.getInitialState>;
	case: ReturnType<typeof caseAdapter.getInitialState>;
	job: ReturnType<typeof jobAdapter.getInitialState>;
};

const codemodAdapter = createEntityAdapter<CodemodEntry>({
	selectId: (codemod) => codemod.hashDigest,
});

const caseAdapter = createEntityAdapter<PersistedCase>({
	selectId: (kase) => kase.hash,
});

const jobAdapter = createEntityAdapter<PersistedJob>({
	selectId: (job) => job.hash,
});

const getInitialState = (): State => {
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
			openedCodemodHashDigests: null,
			visible: true,
		},
		changeExplorerView: {
			focusedFileExplorerNodeId: null,
			openedFileExplorerNodeIds: [],
			visible: false,
		},
		communityView: {
			visible: true,
		},
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
		setCases(state, action: PayloadAction<ReadonlyArray<PersistedCase>>) {
			caseAdapter.setAll(state.case, action.payload);
		},
		upsertCases(
			state,
			action: PayloadAction<ReadonlyArray<PersistedCase>>,
		) {
			caseAdapter.upsertMany(state.case, action.payload);
		},
		setJobs(state, action: PayloadAction<ReadonlyArray<PersistedJob>>) {
			jobAdapter.setAll(state.job, action.payload);
		},
		upsertJobs(state, action: PayloadAction<ReadonlyArray<PersistedJob>>) {
			jobAdapter.upsertMany(state.job, action.payload);
		},
		clearState(state) {
			caseAdapter.removeAll(state.case);
			jobAdapter.removeAll(state.job);
			state.codemodRunsView.selectedCaseHash = null;
			state.caseHashJobHashes = [];
		},
		upsertCodemods(
			state,
			action: PayloadAction<ReadonlyArray<CodemodEntry>>,
		) {
			codemodAdapter.upsertMany(state.codemod, action.payload);
		},
		setCaseHashJobHashes(
			state,
			action: PayloadAction<ReadonlyArray<string>>,
		) {
			state.caseHashJobHashes = [...action.payload];
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
			action: PayloadAction<ReadonlyArray<string> | null>,
		) {
			state.codemodDiscoveryView.visible = true;

			if (action.payload === null) {
				state.codemodDiscoveryView.openedCodemodHashDigests =
					action.payload;
				return;
			}

			state.codemodDiscoveryView.openedCodemodHashDigests = [
				...action.payload,
			];
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
			action: PayloadAction<string | null>,
		) {
			state.changeExplorerView.visible = true;
			state.changeExplorerView.focusedFileExplorerNodeId = action.payload;
		},
		setOpenedFileExplorerNodeIds(
			state,
			action: PayloadAction<ReadonlyArray<string> | null>,
		) {
			state.changeExplorerView.visible = true;

			if (action.payload === null) {
				state.changeExplorerView.openedFileExplorerNodeIds = [];
				return;
			}

			state.changeExplorerView.openedFileExplorerNodeIds = [
				...action.payload,
			];
		},
	},
});

const actions = rootSlice.actions;
const selector = (state: State) => state;

export { actions, selector, SLICE_KEY };

export default rootSlice.reducer;
