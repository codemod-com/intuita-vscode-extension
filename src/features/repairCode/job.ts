import { buildHash, buildIntuitaRangeFromSimpleRange } from '../../utilities';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { JobHash, JobKind, RepairCodeJob } from '../../jobs/types';
import type { File } from '../../files/types';
import { DiagnosticHash } from '../../diagnostics/types';
import { UriHash } from '../../uris/types';
import { buildUriHash } from '../../uris/buildUriHash';

export const buildRepairCodeJobHash = (
	uriHash: UriHash,
	diagnosticHash: DiagnosticHash | null,
	replacementEnvelope: ReplacementEnvelope,
): JobHash => {
	const hash = buildHash(
		[
			uriHash,
			diagnosticHash ?? '',
			String(replacementEnvelope.range.start),
			String(replacementEnvelope.range.end),
			replacementEnvelope.replacement,
		].join(','),
	);

	return hash as JobHash;
};

export const buildRepairCodeJob = (
	file: File,
	diagnosticHash: DiagnosticHash | null,
	replacementEnvelope: ReplacementEnvelope,
): RepairCodeJob => {
	const fileName = file.uri.fsPath;

	const range = buildIntuitaRangeFromSimpleRange(
		file.separator,
		file.lengths,
		replacementEnvelope.range,
	);

	const title = `Repair code on line ${range[0] + 1}`;

	const hash = buildRepairCodeJobHash(
		buildUriHash(file.uri),
		diagnosticHash,
		replacementEnvelope,
	);

	return {
		kind: JobKind.repairCode,
		fileName,
		hash,
		title,
		range,
		replacement: replacementEnvelope.replacement,
		version: file.version,
		fileText: file.text,
		simpleRange: replacementEnvelope.range,
		separator: file.separator,
		diagnosticHash,
	};
};
