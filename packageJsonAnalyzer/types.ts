export type CodemodHash = string & { __type: 'CodemodHash' };
export type PathHash = string & { __type: 'PathHash' };

export type Path = {
	hash: PathHash;
	path: string;
	label: string;
	kind: 'path';
	children: (PathHash | CodemodHash)[];
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
