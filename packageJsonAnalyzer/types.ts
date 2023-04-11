export type CodemodHash = string & { __type: 'CodemodHash' };

export type Path = {
	hash: CodemodHash;
	path: string;
	label: string;
	kind: 'path';
	children: CodemodHash[];
};

export type CodemodItem = {
	hash: CodemodHash;
	commandToExecute: string;
	pathToExecute: string;
	label: string;
	kind: 'codemodItem';
	description: string;
};

type CodemodKind = 'upgrade' | 'migration' | 'remove';

export type PackageUpgradeItem = Readonly<{
	id: string;
	packageName: string;
	name: string;
	kind: CodemodKind;
	leastVersionSupported: string;
	latestVersionSupported: string;
	leastSupportedUpgrade: string;
}>;
