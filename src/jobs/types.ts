import { DiagnosticHash } from '../diagnostics/types';
import type { StringNode } from '../features/moveTopLevelNode/2_factBuilders/stringNodes';
import type { TopLevelNode } from '../features/moveTopLevelNode/2_factBuilders/topLevelNode';
import type {
	IntuitaPosition,
	IntuitaRange,
	IntuitaSimpleRange,
} from '../utilities';

export type JobHash = string & { __type: 'JobHash' };

export const enum JobKind {
	moveTopLevelNode = 1,
	repairCode = 2,
}

export type JobOutput = Readonly<{
	text: string;
	range: IntuitaRange;
	position: IntuitaPosition;
}>;

export type MoveTopLevelNodeJob = Readonly<{
	kind: JobKind.moveTopLevelNode;
	fileName: string;
	hash: JobHash;
	title: string;
	range: IntuitaRange;
	oldIndex: number;
	newIndex: number;
	score: [number, number];
	separator: string;
	stringNodes: ReadonlyArray<StringNode>;
	lengths: ReadonlyArray<number>;
	topLevelNodes: ReadonlyArray<TopLevelNode>;
	diagnosticHash: DiagnosticHash | null;
}>;

export type RepairCodeJob = Readonly<{
	kind: JobKind.repairCode;
	fileName: string;
	version: number;
	hash: JobHash;
	title: string;
	range: IntuitaRange;
	replacement: string;
	fileText: string;
	simpleRange: IntuitaSimpleRange;
	separator: string;
	diagnosticHash: DiagnosticHash | null;
}>;

export type Job = MoveTopLevelNodeJob | RepairCodeJob;
