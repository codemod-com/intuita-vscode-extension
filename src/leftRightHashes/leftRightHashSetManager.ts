export class LeftRightHashSetManager<L extends string, R extends string> {
	protected _set = new Set<string>();

	public constructor(set: ReadonlySet<string>) {
		this._set = new Set(set);
	}

	public buildByRightHashes(
		rightHashes: Set<R>,
	): LeftRightHashSetManager<L, R> {
		const set = new Set<string>();

		this._set.forEach((leftRightHash) => {
			const rightHash = leftRightHash.slice(
				leftRightHash.length / 2,
			) as R;

			if (!rightHashes.has(rightHash)) {
				return;
			}

			set.add(leftRightHash);
		});

		return new LeftRightHashSetManager<L, R>(set);
	}

	public getLeftHashes(): ReadonlySet<L> {
		const set = new Set<L>();

		this._set.forEach((leftRightHash) => {
			const leftHash = leftRightHash.slice(
				0,
				leftRightHash.length / 2,
			) as L;

			set.add(leftHash);
		});

		return set;
	}

	public getRightHashes(): ReadonlySet<R> {
		const rightHashes = new Set<R>();

		this._set.forEach((leftRightHash) => {
			const rightHash = leftRightHash.slice(
				leftRightHash.length / 2,
			) as R;

			rightHashes.add(rightHash);
		});

		return rightHashes;
	}

	public getRightHashesByLeftHash(leftHash: L): ReadonlySet<R> {
		const rightHashes = new Set<R>();

		this._set.forEach((leftRightHash) => {
			if (!leftRightHash.startsWith(leftHash)) {
				return;
			}

			const rightHash = leftRightHash.slice(leftHash.length);

			rightHashes.add(rightHash as R);
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
		const deletableHashes: string[] = [];

		for (const leftRightHash of this._set.keys()) {
			if (leftRightHash.endsWith(rightHash)) {
				deletableHashes.push(leftRightHash);
			}
		}

		for (const hash of deletableHashes) {
			this._set.delete(hash);
		}
	}

	protected _buildLeftRightHash(leftHash: L, rightHash: R): string {
		return `${leftHash}${rightHash}`;
	}
}
