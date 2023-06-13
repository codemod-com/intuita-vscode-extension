import type { WebStorage } from 'redux-persist';
import { Memento } from 'vscode';

// redux-persists storage impl for vscode memento
class MementoStorage implements WebStorage {
	constructor(private readonly __memento: Memento) {}

	public getItem(key: string): Promise<string | null> {
		return new Promise<string | null>((resolve) => {
			const storedValue = this.__memento.get(key);

			resolve(typeof storedValue !== 'string' ? null : storedValue);
		});
	}

	public setItem(key: string, value: string): Promise<void> {
		return new Promise((resolve) => {
			this.__memento.update(key, value);

			resolve();
		});
	}

	public removeItem(key: string): Promise<void> {
		return new Promise((resolve) => {
			this.__memento.update(key, void 0);

			resolve();
		});
	}

	public getAllKeys(): Promise<ReadonlyArray<string>> {
		return new Promise((resolve) => {
			const allKeys = this.__memento.keys();

			resolve(allKeys);
		});
	}
}

export default MementoStorage;
