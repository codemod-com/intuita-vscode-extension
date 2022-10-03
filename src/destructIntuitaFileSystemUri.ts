import { JobHash } from './features/moveTopLevelNode/jobHash';

const FS_PATH_START_REG_EXP = /^\/vfs\/(jobs|files)\/([a-z]+)/;
const FS_PATH_END_REG_EXP = /\/([a-zA-Z0-9-_=]+)\.(ts|tsx|js|jsx)$/;

// call the function parseInternalUri
// return type = ParsedInternalUri
export const destructIntuitaFileSystemUri = (uri: {
	scheme: string;
	fsPath: string;
}) => {
	if (uri.scheme !== 'intuita') {
		throw new Error('Cannot destruct a non-Intuita URI');
	}

	const startArray = FS_PATH_START_REG_EXP.exec(uri.fsPath);

	if (!startArray) {
		throw new Error(
			'Cannot destruct an URI that does not match the start pattern',
		);
	}

	const directory = startArray[1];
	const startLength = startArray[0]?.length ?? 0;

	if (directory === 'files') {
		return {
			directory: 'files' as const,
			scheme: startArray[2] ?? '',
			fsPath: uri.fsPath.slice(startLength),
		};
	}

	const endArray = FS_PATH_END_REG_EXP.exec(uri.fsPath);

	if (!endArray) {
		throw new Error(
			'Cannot destruct an URI that does not match the end pattern',
		);
	}

	const endLength = endArray[0]?.length ?? 0;

	const fsPath = uri.fsPath.slice(startLength, uri.fsPath.length - endLength);

	return {
		directory: 'jobs' as const,
		scheme: startArray[2] ?? '',
		fsPath,
		jobHash: (endArray[1]?.slice(15) ?? '') as JobHash,
	};
};
