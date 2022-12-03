import type { Uri } from "vscode";
import { buildJobHash } from "./buildJobHash";
import { CreateFileJob, JobKind } from "./types";

export const buildCreateFileJob = (
	targetUri: Uri,
	contentUri: Uri,
	codemodId: string,
): CreateFileJob => {
	return {
		kind: JobKind.createFile,
		targetUri,
		title: `Create a file (${codemodId})`,
		hash: buildJobHash([targetUri, contentUri], codemodId),
		contentUri,
	};
};