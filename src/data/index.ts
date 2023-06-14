import { configureStore, Dispatch } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import MementoStorage from './storage';

import rootReducer, { actions } from './slice';
import { Memento } from 'vscode';

const buildStore = (workspaceState: Memento) => {
	const persistConfig = {
		key: 'root',
		storage: new MementoStorage(workspaceState),
	};

	const persistedReducer = persistReducer(persistConfig, rootReducer);

	const store = configureStore({
		reducer: persistedReducer,
	});

	const persistor = persistStore(store);

	return { store, persistor };
};

type RootState = ReturnType<typeof rootReducer>;
type ActionCreators = typeof actions;
type Actions = { [K in keyof ActionCreators]: ReturnType<ActionCreators[K]> };
type Action = Actions[keyof Actions];

type AppDispatch = Dispatch<Action>;
type Store = ReturnType<typeof buildStore>['store'];

export { buildStore };

export type { RootState, AppDispatch, Store };
