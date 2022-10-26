export class LeftRightHashSetManager<L extends string, R extends string> {
	protected _set = new Set<string>();

	public getRightHashes(): ReadonlyArray<R> {
		const rightHashes: R[] = [];

		this._set.forEach((leftRightHash) => {
			const rightHash = leftRightHash.slice(leftRightHash.length / 2);

			rightHashes.push(rightHash as R);
		});

		return rightHashes;
	}

	public getRightHashesByLeftHash(leftHash: L): ReadonlyArray<R> {
		const rightHashes: R[] = [];

		this._set.forEach((leftRightHash) => {
			if (!leftRightHash.startsWith(leftHash)) {
				return;
			}

			const rightHash = leftRightHash.slice(leftHash.length);

			rightHashes.push(rightHash as R);
		});

		return rightHashes;
	}

	public upsert(leftHash: L, rightHash: R): void {
		const hash = this._buildLeftRightHash(leftHash, rightHash);

		this._set.add(hash);
	}

	public delete(leftHash: L, rightHash: R): void {
		const hash = this._buildLeftRightHash(leftHash, rightHash);

		this._set.delete(hash);
	}

	public deleteRightHash(rightHash: R): void {
		const deletables: string[] = [];

		for (const leftRightHash of this._set.keys()) {
			if (leftRightHash.endsWith(rightHash)) {
				deletables.push(leftRightHash);
			}
		}

		for (const deletable of deletables) {
			this._set.delete(deletable);
		}
	}

	protected _buildLeftRightHash(leftHash: L, rightHash: R): string {
		return `${leftHash}${rightHash}`;
	}
}
