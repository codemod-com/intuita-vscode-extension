import { Memento } from 'vscode';

// redux-persists storage impl for vscode memento
class MementoStorage {
	constructor(private readonly __memento: Memento) {}

	public getItem(key: string): Promise<unknown> {
		return new Promise((resolve) => {
			const storedValue = this.__memento.get(key);
			resolve(storedValue);
		});
	}

	public setItem(key: string, value: string): Promise<void> {
		return new Promise((resolve) => {
			this.__memento.update(key, value);

			resolve(void 0);
		});
	}

	public removeItem(key: string): Promise<void> {
		return new Promise((resolve) => {
			this.__memento.update(key, void 0);

			resolve(void 0);
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
