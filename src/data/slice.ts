import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

const SLICE_KEY = 'root';

const getInitialState = () => {
	return {
		test: '1',
	};
};

const rootSlice = createSlice({
	name: SLICE_KEY,
	initialState: getInitialState(),
	reducers: {
		testAction(state, action: PayloadAction<string>) {
			state.test = action.payload;
		},
	},
});

const { testAction } = rootSlice.actions;
const selector = (state: RootState) => state;

export { testAction, selector, SLICE_KEY };

export default rootSlice.reducer;
