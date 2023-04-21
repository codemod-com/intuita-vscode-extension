import * as t from 'io-ts';
import { createHash } from 'crypto';
import { Uri, Webview } from 'vscode';
import { Element, ElementKind } from './elements/types';

export type IntuitaRange = Readonly<[number, number, number, number]>;

export function isNeitherNullNorUndefined<T>(
	value: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): value is T & {} {
	return value !== null && value !== undefined;
}

export type DistributiveOmit<T, K extends keyof T> = T extends unknown
	? Omit<T, K>
	: never;

export function assertsNeitherNullOrUndefined<T>(
	value: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): asserts value is T & {} {
	if (value === null || value === undefined) {
		throw new Error('The value cannot be null or undefined');
	}
}

export const buildHash = (data: string) =>
	createHash('ripemd160').update(data).digest('base64url');

export const buildTypeCodec = <T extends t.Props>(
	props: T,
): t.ReadonlyC<t.ExactC<t.TypeC<T>>> => t.readonly(t.exact(t.type(props)));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <R>(callback: (...args: any[]) => R, ms: number) => {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (...args: any[]) => {
		if (timeout !== null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => callback(...args), ms);
	};
};

export const timeout = (ms: number) =>
	new Promise((_, reject) =>
		setTimeout(
			() =>
				reject(new Error('Timeout while looking for a git repository')),
			ms,
		),
	);

export const singleQuotify = (str: string) => `'${str}'`;

export function getUri(
	webview: Webview,
	extensionUri: Uri,
	pathList: string[],
) {
	return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export const getElementIconBaseName = (kind: Element['kind']): string => {
	switch (kind) {
		case ElementKind.CASE:
			return 'case.svg';
		case ElementKind.FILE:
			return 'ts2.svg';
		case ElementKind.JOB:
			return 'bluelightbulb.svg';
		case ElementKind.ROOT:
			return 'wrench.svg';
		default:
			return 'bluelightbulb.svg';
	}
};

export const branchNameFromStr = (str: string): string => {
	let branchName = str
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');

	if (branchName.length > 63) {
		branchName = branchName.substr(0, 63);
	}

	if (!/^[a-z0-9]/.test(branchName)) {
		branchName = 'x-' + branchName;
	}

	return branchName;
};

export const capitalize = (str: string): string => {
	if (!str) return '';

	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const buildTreeRootLabel = (caseLabel: string | null) => {
	if (!caseLabel) {
		return 'Recipe';
	}

	// this is based on the current phrase system in the Codemod Registry repo: https://github.com/intuita-inc/codemod-registry
	const [framework, version] = caseLabel.split('/');
	if (!framework || !version) {
		return 'Recipe';
	}

	return `Upgrade ${capitalize(framework)} to v${version}`;
};

export const buildStackedBranchPRMessage = (
	stackedBranches: readonly string[],
): string => {
	let message = `Current dependencies on/for this PR: \n`;

	stackedBranches.forEach((branchName, i) => {
		const ident = '   '.repeat(i);
		message += ` \n ${ident} ${i !== 0 ? '\u{231E}' : ''} ${branchName}`;
	});

	return message;
};
