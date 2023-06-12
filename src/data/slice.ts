import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';
import { Case } from '../cases/types';
import { Job } from '../jobs/types';
import { CodemodEntry } from '../codemods/types';
import { ExecutionError } from '../errors/types';

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
	openedFileExplorerNodeIds: ReadonlyArray<string> | null;
}>;

type CommunityState = Readonly<{
	visible: boolean;
}>;

type State = {
	codemodDiscovery: CodemodDiscoveryState;
	codemodRuns: CodemodRunsState;
	changeExplorer: ChangeExplorerState;
	community: CommunityState;
	lastCodemodHashDigests: ReadonlyArray<string>;
	executionErrors: Record<string, ReadonlyArray<ExecutionError>>;
	codemod: ReturnType<typeof codemodAdapter.getInitialState>;
	case: ReturnType<typeof caseAdapter.getInitialState>;
	job: ReturnType<typeof jobAdapter.getInitialState>;
};

const codemodAdapter = createEntityAdapter<CodemodEntry>({
	selectId: (codemod) => codemod.hashDigest,
});

const caseAdapter = createEntityAdapter<Case>({
	selectId: (kase) => kase.hash,
});

const jobAdapter = createEntityAdapter<Job>({
	selectId: (job) => job.hash,
});

const getInitialState = (): State => {
	return {
		codemod: codemodAdapter.getInitialState(),
		case: caseAdapter.getInitialState(),
		job: jobAdapter.getInitialState(),
		lastCodemodHashDigests: [],
		executionErrors: {},
		codemodRuns: {
			selectedCaseHash: null,
			visible: true,
		},
		codemodDiscovery: {
			executionPaths: {},
			focusedCodemodHashDigest: null,
			openedCodemodHashDigests: null,
			visible: true,
		},
		changeExplorer: {
			visible: false,
		},
		community: {
			visible: true,
		},
	};
};

const rootSlice = createSlice({
	name: SLICE_KEY,
	initialState: getInitialState(),
	reducers: {
		upsertCases(state, action: PayloadAction<Case[]>) {
			caseAdapter.upsertMany(state.case, action.payload);
		},
		upsertJobs(state, action: PayloadAction<Job[]>) {
			jobAdapter.upsertMany(state.job, action.payload);
		},
		clearState(state) {
			caseAdapter.removeAll(state.case);
			jobAdapter.removeAll(state.job);
			state.codemodRuns.selectedCaseHash = null;
		},
		upsertCodemods(
			state,
			action: PayloadAction<ReadonlyArray<CodemodEntry>>,
		) {
			codemodAdapter.upsertMany(state.codemod, action.payload);
		},
		removeCodemod(state, action) {
			codemodAdapter.removeOne(state.codemod, action.payload);
		},
		updateCodemod(state, action) {
			codemodAdapter.updateOne(state.codemod, action.payload);
		},
		/**
		 * Codemod runs
		 */
		setSelectedCaseHash(state, action: PayloadAction<string | null>) {
			state.codemodRuns.selectedCaseHash = action.payload;
		},
		setCodemodRunsVisible(state, action: PayloadAction<boolean>) {
			state.codemodRuns.visible = action.payload;
		},
		/**
		 * Codemod list
		 */
		setPublicCodemodsExpanded(state, action: PayloadAction<boolean>) {
			state.codemodDiscovery.visible = action.payload;
		},
		setExecutionPath(
			state,
			action: PayloadAction<{ codemodHash: string; path: string }>,
		) {
			const { codemodHash, path } = action.payload;
			state.codemodDiscovery.executionPaths[codemodHash] = path;
		},
		setRecentCodemodHashes(state, action: PayloadAction<string>) {
			state.lastCodemodHashDigests.push(action.payload);
		},
		setFocusedCodemodHashDigest(
			state,
			action: PayloadAction<string | null>,
		) {
			state.codemodDiscovery.visible = true;
			state.codemodDiscovery.focusedCodemodHashDigest = action.payload;
		},
		setOpenedCodemodHashDigests(
			state,
			action: PayloadAction<ReadonlyArray<string> | null>,
		) {
			state.codemodDiscovery.visible = true;
			state.codemodDiscovery.openedCodemodHashDigests = action.payload;
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
			state.executionErrors[caseHash] = errors;
		},
		/**
		 * Change explorer
		 */
		setFocusedFileExplorerNodeId(
			state,
			action: PayloadAction<string | null>,
		) {
			state.changeExplorer.visible = true;
			state.changeExplorer.focusedFileExplorerNodeId = action.payload;
		},
		setOpenedFileExplorerNodeIds(
			state,
			action: PayloadAction<ReadonlyArray<string> | null>,
		) {
			state.changeExplorer.visible = true;
			state.changeExplorer.openedFileExplorerNodeIds = action.payload;
		},
	},
});

const actions = rootSlice.actions;
const selector = (state: State) => state;

export { actions, selector, SLICE_KEY };

export default rootSlice.reducer;
