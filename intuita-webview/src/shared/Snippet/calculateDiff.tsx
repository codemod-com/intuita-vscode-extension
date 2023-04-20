import { monaco } from './DiffEditor';

export type Diff = { added: number; removed: number };

export const getDiff = (lineChanges: monaco.editor.ILineChange[]): Diff => {
	const diff = new Map<keyof Diff, number>();
	lineChanges.forEach((lineChange) => {
		if (lineChange.modifiedEndLineNumber !== 0) {
			diff.set(
				'added',
				(diff.get('added') ?? 0) +
					lineChange.modifiedEndLineNumber -
					lineChange.modifiedStartLineNumber +
					1,
			);
		}
		if (lineChange.originalEndLineNumber !== 0) {
			diff.set(
				'removed',
				(diff.get('removed') ?? 0) +
					lineChange.originalEndLineNumber -
					lineChange.originalStartLineNumber +
					1,
			);
		}
	});

	return {
		added: diff.get('added') ?? 0,
		removed: diff.get('removed') ?? 0,
	};
};
