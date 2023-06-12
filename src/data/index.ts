import { configureStore, Dispatch } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
// import loggerMiddleware from 'redux-logger';
import MementoStorage from './storage';

import rootReducer, { actions } from './slice';
import { Memento } from 'vscode';

const buildStore = (workspaceState: Memento) => {
	const persistConfig = {
		key: 'root',
		storage: new MementoStorage(workspaceState),
		// debugger: console.log,
	};

	const persistedReducer = persistReducer(persistConfig, rootReducer);

	// @TODO ensure that building with NODE_ENV=production var, otherwise default dev middleware will be included
	const store = configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) => {
			const middleware = getDefaultMiddleware();

			if (process.env.NODE_ENV !== 'production') {
				// middleware.push(loggerMiddleware)
			}

			return middleware;
		},
	});

	const persistor = persistStore(store);
	store.subscribe(() => {
		console.log(store.getState());
	});
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
