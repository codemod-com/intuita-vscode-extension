import { buildCaseHash } from '../cases/buildCaseHash';
import type { Case, CaseWithJobHashes } from '../cases/types';
import { stringifyCode } from '../diagnostics/stringifyCode';
import { buildRepairCodeJob } from '../features/repairCode/job';
import type { Job, JobHash } from '../jobs/types';
import { calculateSimilarity } from './similarity';
import type { JobIngredients } from './types';

export const buildCases = (
	existingCasesWithJobHashes: Iterable<CaseWithJobHashes>,
	jobIngredients: Iterable<JobIngredients>,
) => {
	const casesWithJobHashes = Array.from(existingCasesWithJobHashes).map((kase) => ({
		...kase,
		jobHashes: new Set(kase.jobHashes),
	}));

	const jobs: Job[] = [];

	for (const jobIngredient of jobIngredients) {
		const job = buildRepairCodeJob(
			jobIngredient.file,
			jobIngredient.enhancedDiagnostic.hash,
			jobIngredient.inferenceJob,
		);

		const code = stringifyCode(jobIngredient.enhancedDiagnostic.diagnostic.code);

		const existingCase = casesWithJobHashes.find(
			(kase) =>
				kase.kind === jobIngredient.classification.kind && kase.code === code,
		);

		if (
			existingCase &&
			calculateSimilarity(existingCase.node, jobIngredient.classification.node) >
				0.5
		) {
			existingCase.jobHashes.add(job.hash);
			jobs.push(job);
			continue;
		}

		const caseHash = buildCaseHash(jobIngredient.classification.kind, code, job.hash);

		const kase: Case & { jobHashes: Set<JobHash> } = {
			hash: caseHash,
			kind: jobIngredient.classification.kind,
			code: stringifyCode(jobIngredient.enhancedDiagnostic.diagnostic.code),
			jobHashes: new Set([job.hash]),
			node: jobIngredient.classification.node,
		};

		casesWithJobHashes.push(kase);
		jobs.push(job);
	}

	return {
		casesWithJobHashes,
		jobs,
	};
};
