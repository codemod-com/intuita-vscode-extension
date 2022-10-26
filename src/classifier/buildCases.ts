import { buildCaseHash } from '../cases/buildCaseHash';
import type { Case, CaseWithJobHashes } from '../cases/types';
import { stringifyCode } from '../diagnostics/stringifyCode';
import { buildRepairCodeJob } from '../features/repairCode/job';
import type { Job, JobHash } from '../jobs/types';
import { calculateSimilarity } from './similarity';
import type { JobIngredients } from './types';

export const buildCases = (
	existingCasesWithJobHashes: ReadonlyArray<CaseWithJobHashes>,
	jobIngredients: ReadonlyArray<JobIngredients>,
) => {
	const casesWithJobHashes = existingCasesWithJobHashes.map((kase) => ({
		...kase,
		jobHashes: kase.jobHashes.slice(),
	}));

	const jobs: Job[] = [];

	jobIngredients.forEach(
		({ classification, enhancedDiagnostic, file, inferenceJob }) => {
			const job = buildRepairCodeJob(
				file,
				enhancedDiagnostic.hash,
				inferenceJob,
			);

			const code = stringifyCode(enhancedDiagnostic.diagnostic.code);

			const existingCase = casesWithJobHashes.find(
				(kase) =>
					kase.kind === classification.kind && kase.code === code,
			);

			if (
				existingCase &&
				calculateSimilarity(existingCase.node, classification.node) >
					0.5
			) {
				existingCase.jobHashes.push(job.hash);
				jobs.push(job);
				return;
			}

			const caseHash = buildCaseHash(classification.kind, code, job.hash);

			const kase: Case & { jobHashes: JobHash[] } = {
				hash: caseHash,
				kind: classification.kind,
				code: stringifyCode(enhancedDiagnostic.diagnostic.code),
				jobHashes: [job.hash],
				node: classification.node,
			};

			casesWithJobHashes.push(kase);
			jobs.push(job);
		},
	);

	return {
		casesWithJobHashes,
		jobs,
	};
};
