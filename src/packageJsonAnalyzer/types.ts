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
	commandToExecute: string;
	pathToExecute: string;
	description: string;
}>;

export type CodemodElement = CodemodItem | CodemodPath;

export type PackageUpgradeItem = Readonly<{
	id: string;
	packageName: string;
	name: string;
	kind: 'upgrade' | 'migration' | 'remove';
	leastVersionSupported: string;
	latestVersionSupported: string;
	leastSupportedUpgrade: string;
}>;
