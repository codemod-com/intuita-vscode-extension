import { buildHash } from '../../utilities';
import { JobHash } from '../moveTopLevelNode/jobHash';
import { InferenceJob } from '../../components/inferenceService';

export const buildRepairCodeJobHash = (
	fileName: string,
	inferenceJob: InferenceJob,
): JobHash => {
	const data = [
		fileName,
		'range' in inferenceJob
			? inferenceJob.range.map((r) => String(r)).join(',')
			: String(inferenceJob.lineNumber),
		inferenceJob.replacement,
	]
		.map((value) => String(value))
		.join(',');

	const hash = buildHash(data);

	return hash as JobHash;
};
