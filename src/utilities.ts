import * as t from 'io-ts';
import { createHash } from 'crypto';
import { Uri, Webview } from 'vscode';
import { Element, ElementKind } from './elements/types';
import { JobKind } from './jobs/types';

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
export const doubleQuotify = (str: string) => `"${str}"`;

export function getUri(
	webview: Webview,
	extensionUri: Uri,
	pathList: string[],
) {
	return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export const getElementIconBaseName = (
	kind: Element['kind'],
	jobKind: JobKind | null,
): string => {
	switch (kind) {
		case ElementKind.CASE:
			return 'case.svg';
		case ElementKind.FILE:
			return jobKind !== null &&
				[
					JobKind.copyFile,
					JobKind.createFile,
					JobKind.moveAndRewriteFile,
					JobKind.moveFile,
				].includes(jobKind)
				? 'newFile.svg'
				: 'file.svg';
		case ElementKind.JOB:
			return 'bluelightbulb.svg';
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
	if (!str) {
		return '';
	}

	return str.charAt(0).toUpperCase() + str.slice(1);
};

// taken from https://stackoverflow.com/a/63361543
export const streamToString = async (stream: NodeJS.ReadableStream) => {
	const chunks = [];

	for await (const chunk of stream) {
		if (chunk instanceof Buffer) {
			chunks.push(chunk);
			continue;
		}

		chunks.push(Buffer.from(chunk));
	}

	return Buffer.concat(chunks).toString('utf-8');
};

export const buildCodemodMetadataHash = (name: string) =>
	createHash('ripemd160')
		.update('README.md')
		.update(name)
		.digest('base64url');
