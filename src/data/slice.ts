import {
	createSlice,
	createEntityAdapter,
	PayloadAction,
} from '@reduxjs/toolkit';
import { Case } from '../cases/types';
import { Job } from '../jobs/types';
import { CodemodEntry } from '../codemods/types';

const SLICE_KEY = 'root';

type CodemodDiscoveryState = {
	openedCodemodHashDigests: string | null;
	focusedCodemodHashDigest: string | null;
	executionPaths: Record<string, string>;
	visible: boolean;
};

type CodemodRunsState = {
	selectedCaseHash: string | null;
	visible: boolean;
};

type ChangeExplorerState = {
	visible: boolean;
};

type CommunityState = {
	visible: boolean;
};

type State = Readonly<{
	codemodDiscovery: CodemodDiscoveryState;
	codemodRuns: CodemodRunsState;
	changeExplorer: ChangeExplorerState;
	community: CommunityState;
	codemod: ReturnType<typeof codemodAdapter.getInitialState>;
	case: ReturnType<typeof caseAdapter.getInitialState>;
	job: ReturnType<typeof jobAdapter.getInitialState>;
}>;

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
		upsertCodemods(state, action: PayloadAction<ReadonlyArray<CodemodEntry>>) {
			codemodAdapter.upsertMany(state.codemod, action.payload);
		},
		removeCodemod(state, action) {
			codemodAdapter.removeOne(state.codemod, action.payload);
		},
		updateCodemod(state, action) {
			codemodAdapter.updateOne(state.codemod, action.payload);
		},
		setSelectedCaseHash(state, action: PayloadAction<string>) {
			state.codemodRuns.selectedCaseHash = action.payload;
		},
	},
});

const actions = rootSlice.actions;
const selector = (state: State) => state;

export { actions, selector, SLICE_KEY };

export default rootSlice.reducer;
