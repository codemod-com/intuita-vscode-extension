export type CodemodHash = string & { __type: 'CodemodHash' };

export type CodemodPath = Readonly<{
	hash: CodemodHash;
	kind: 'path';
	label: string;
	path: string;
	children: CodemodHash[];
}>;

export type CodemodItem = Readonly<{
	hash: CodemodHash;
	kind: 'codemodItem';
	label: string;
	description: string;
	name: string;
}>;

export type CodemodElement = CodemodItem | CodemodPath;

