import { buildIntuitaSimpleRange, IntuitaRange } from '../../utilities';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { JobHash, JobKind, RepairCodeJob } from '../../jobs/types';
import type { File } from '../../files/types';
import { DiagnosticHash } from '../../diagnostics/types';

export const buildRepairCodeJob = (
	file: File,
	diagnosticHash: DiagnosticHash,
	inferenceJob: ReplacementEnvelope,
): RepairCodeJob => {
	const fileName = file.uri.fsPath;

	const intuitaRange: IntuitaRange =
		'range' in inferenceJob
			? inferenceJob.range
			: [
					inferenceJob.lineNumber,
					0,
					inferenceJob.lineNumber,
					file.lengths[inferenceJob.lineNumber] ?? 0,
			  ];

	const range = buildIntuitaSimpleRange(
		file.separator,
		file.lengths,
		intuitaRange,
	);

	const lineNumber =
		'range' in inferenceJob
			? inferenceJob.range[0]
			: inferenceJob.lineNumber;

	const title = `Repair code on line ${lineNumber + 1}`;

	return {
		kind: JobKind.repairCode,
		fileName,
		hash: diagnosticHash as unknown as JobHash,
		title,
		range: intuitaRange,
		replacement: inferenceJob.replacement,
		version: file.version,
		fileText: file.text,
		simpleRange: range,
		separator: file.separator,
	};
};
