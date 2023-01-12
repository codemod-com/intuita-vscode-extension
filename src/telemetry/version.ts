import * as semver from 'semver';

export const buildFourByteBase64UrlVersion = (
	version: string,
): string | null => {
	const semVerObject = semver.parse(version);

	if (!semVerObject) {
		return null;
	}

	const major = semVerObject.major & 0xff;
	const minor = semVerObject.minor & 0xff;
	const patch = semVerObject.patch & 0xff;

	const uint8Array = new Uint8Array([major, minor, patch, 0]);

	return Buffer.from(uint8Array).toString('base64url');
};
