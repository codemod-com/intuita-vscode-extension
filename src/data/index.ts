import { configureStore, Dispatch } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import MementoStorage from './storage';

import rootReducer from './slice';
import { Memento } from 'vscode';

const buildStore = (workspaceState: Memento) => {
	const persistConfig = {
		key: 'root',
		storage: new MementoStorage(workspaceState),
		debugger: console.log,
	};

	const persistedReducer = persistReducer(persistConfig, rootReducer);

	// @TODO ensure that builing with NODE_ENV=production var, otherwise default dev middleware will be included
	const store = configureStore({
		reducer: persistedReducer,
	});

	const persistor = persistStore(store);

	return { store, persistor };
};

type RootState = ReturnType<typeof rootReducer>;
// @TODO
type AppDispatch = Dispatch<any>;

export { buildStore };

export type { RootState, AppDispatch };
