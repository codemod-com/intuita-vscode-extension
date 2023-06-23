import { configureStore, Dispatch, Reducer } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import MementoStorage from './storage';

import rootReducer, { actions, getInitialState } from './slice';
import { Memento } from 'vscode';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { persistedStateCodecNew } from '../persistedState/codecs';

const PERSISTANCE_PREFIX = 'persist';
const PERSISTANCE_KEY = 'compressedRoot';

const deserializeState = (serializedState: string) => {
	const parsedState: Record<string, unknown> = {};

	try {
		const rawState = JSON.parse(serializedState);

		Object.keys(rawState).forEach((key) => {
			parsedState[key] = JSON.parse(rawState[key]);
		});
	} catch (e) {
		console.log(e);
	}

	return parsedState;
};

const buildStore = async (workspaceState: Memento) => {
	const storage = new MementoStorage(workspaceState);

	const persistedReducer = persistReducer(
		{
			key: PERSISTANCE_KEY,
			storage,
			// throttle: 1000,
		},
		rootReducer,
	);

	const validatedReducer: Reducer<
		(RootState & PersistPartial) | undefined
	> = (state, action) => {
		if (action.type === 'persist/REHYDRATE') {
			const decoded = persistedStateCodecNew.decode(action.payload);

			const validatedPayload =
				decoded._tag === 'Right' ? decoded.right : getInitialState();

			return persistedReducer(state, {
				...action,
				payload: validatedPayload,
			});
		}

		return persistedReducer(state, action);
	};

	const initialState =
		(await storage.getItem(`${PERSISTANCE_PREFIX}:${PERSISTANCE_KEY}`)) ??
		'';
	const deserializedState = deserializeState(initialState);

	const decodedState = persistedStateCodecNew.decode(deserializedState);

	// should never happen because of codec fallback
	if (decodedState._tag !== 'Right') {
		throw new Error('Invalid state');
	}

	console.log(decodedState.right);

	const store = configureStore({
		reducer: validatedReducer,
		preloadedState: decodedState.right,
	});

	const persistor = persistStore(store);
	return { store, persistor };
};

type RootState = ReturnType<typeof rootReducer>;
type ActionCreators = typeof actions;
type Actions = { [K in keyof ActionCreators]: ReturnType<ActionCreators[K]> };
type Action = Actions[keyof Actions];

type AppDispatch = Dispatch<Action>;
type Store = Awaited<ReturnType<typeof buildStore>>['store'];

export { buildStore };

export type { RootState, AppDispatch, Store };
