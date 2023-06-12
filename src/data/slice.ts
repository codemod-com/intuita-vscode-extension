import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Case } from '../cases/types';
import { Job } from '../jobs/types';
import { CodemodEntry } from '../codemods/types';

const SLICE_KEY = 'root';

type CodemodDiscoveryState  = {
	openedCodemodHashDigests: string;
	focusedCodemodHashDigest: string;
	executionPaths: Record<string, string>;
	visible: boolean;
}

type CodemodRunsState  = {
	selectedCaseHash: string;
	visible: boolean;
}

type ChangeExplorerState = {
	visible: boolean;
}

type CommunityState  = {
	visible: boolean;
}

type State = Readonly<{
	case: Record<string, Case>;
	job: Record<string, Job>;
	codemodDiscovery: CodemodDiscoveryState;
	codemodRuns: CodemodRunsState;
	changeExplorer: ChangeExplorerState;
	community: CommunityState;
}>;

const codemodAdapter = createEntityAdapter<CodemodEntry>({
  selectId: (codemod) => codemod.hashDigest
});

const caseAdapter = createEntityAdapter<Case>({
	selectId: (kase) => kase.hash
});

const jobAdapter = createEntityAdapter<Job>({
	selectId: (job) => job.hash,
})

const getInitialState = () => {
	return {
		codemod: codemodAdapter.getInitialState(), 
		case: caseAdapter.getInitialState(), 
		job: jobAdapter.getInitialState(), 
	};
};

const rootSlice = createSlice({
	name: SLICE_KEY,
	initialState: getInitialState(),
	reducers: {},
});

const actions = rootSlice.actions;
const selector = (state: State) => state;

export { actions, selector, SLICE_KEY };

export default rootSlice.reducer;
