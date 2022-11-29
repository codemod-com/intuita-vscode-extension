const FS_PATH_START_REG_EXP = /^\/vfs\/(files)\/([a-z]+)/;

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

	const startLength = startArray[0]?.length ?? 0;

	return {
		directory: 'files' as const,
		scheme: startArray[2] ?? '',
		fsPath: uri.fsPath.slice(startLength),
	};
};
