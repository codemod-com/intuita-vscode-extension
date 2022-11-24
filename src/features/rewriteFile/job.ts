import type { Uri } from "vscode";
import { JobHash, JobKind, RewriteFileJob } from "../../jobs/types";
import { buildUriHash } from "../../uris/buildUriHash";
import { buildHash } from "../../utilities";

export const buildRewriteFileJobHash = (
    inputUri: Uri,
    outputUri: Uri,
): JobHash => {
    const inputUriHash = buildUriHash(inputUri);
    const outputUriHash = buildUriHash(outputUri);

    const hash = buildHash(
		[
			inputUriHash,
            outputUriHash
		].join(','),
	);

	return hash as JobHash;
}

export const buildRewriteFileJob = (
    inputUri: Uri,
    outputUri: Uri,
): RewriteFileJob => {
    return {
        kind: JobKind.rewriteFile,
        fileName: inputUri.fsPath,
        title: 'Rewrite the file',
        hash: buildRewriteFileJobHash(inputUri, outputUri),
        outputUri,
        diagnosticHash: null,
    }
}