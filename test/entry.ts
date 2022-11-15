export type Entry = Readonly<{
	startLineNumber: number;
	startColumn: number;
	endLineNumber: number;
	endColumn: number;
	code: number;
	message: string;
}>;
