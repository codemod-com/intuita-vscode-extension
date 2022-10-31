import { buildIntuitaRangeFromSimpleRange } from '../../utilities';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { JobHash, JobKind, RepairCodeJob } from '../../jobs/types';
import type { File } from '../../files/types';
import { DiagnosticHash } from '../../diagnostics/types';

export const buildRepairCodeJob = (
	file: File,
	diagnosticHash: DiagnosticHash,
	replacementEnvelope: ReplacementEnvelope,
): RepairCodeJob => {
	const fileName = file.uri.fsPath;

	const range = buildIntuitaRangeFromSimpleRange(file.separator, file.lengths, replacementEnvelope.range);

	const title = `Repair code on line ${range[0] + 1}`;

	return {
		kind: JobKind.repairCode,
		fileName,
		hash: diagnosticHash as unknown as JobHash,
		title,
		range,
		replacement: replacementEnvelope.replacement,
		version: file.version,
		fileText: file.text,
		simpleRange: replacementEnvelope.range,
		separator: file.separator,
	};
};
