import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const UrlParamKeys = {
	engine: 'engine' as const,
	beforeSnippet: 'beforeSnippet' as const,
	afterSnippet: 'afterSnippet' as const,
	codemodSource: 'codemodSource' as const,
	codemodName: 'codemodName' as const,
	codemodHashDigest: 'chd' as const,
};

export const getUrlParams = async (hash: string): Promise<string | null> => {
	const globalStoragePath = join(homedir(), '.intuita');
	const urlParamsPath = join(globalStoragePath, hash, 'urlParams.json');
	if (!existsSync(urlParamsPath)) {
		return null;
	}
	const urlParamsData = await readFile(urlParamsPath, {
		encoding: 'utf8',
	});
	return urlParamsData.toString();
};

export const extractValueFromURLParams = (
	urlParamsData: string,
	key: keyof typeof UrlParamKeys,
): string | null => {
	// find codemod name from the stored url parameters
	const urlParams = new URLSearchParams(JSON.parse(urlParamsData).urlParams);
	const value = urlParams.get(key);
	if (value !== null) {
		return Buffer.from(value, 'base64url').toString('utf8');
	}
	return null;
};
