import { buildCaseHash } from '../cases/buildCaseHash';
import { Case, CaseKind, CaseWithJobHashes } from '../cases/types';
import { stringifyCode } from '../diagnostics/stringifyCode';
import { buildRepairCodeJob } from '../features/repairCode/job';
import type { Job, JobHash } from '../jobs/types';
import { calculateSimilarity } from './similarity';
import type { JobIngredients } from './types';

export const buildCases = (
	existingCasesWithJobHashes: Iterable<CaseWithJobHashes>,
	jobIngredients: Iterable<JobIngredients>,
) => {
	const casesWithJobHashes = Array.from(existingCasesWithJobHashes).map(
		(kase) => ({
			...kase,
			jobHashes: new Set(kase.jobHashes),
		}),
	);

	const jobs: Job[] = [];

	for (const jobIngredient of jobIngredients) {
		const job = buildRepairCodeJob(
			jobIngredient.file,
			jobIngredient.enhancedDiagnostic.hash,
			jobIngredient.replacementEnvelope,
		);

		const code = stringifyCode(
			jobIngredient.enhancedDiagnostic.diagnostic.code,
		);

		const existingCase = casesWithJobHashes.find((kase) => {
			if (kase.kind !== CaseKind.REPAIR_CODE_BY_TSC) {
				return false;
			}

			return (
				kase.subKind === jobIngredient.classification.subKind &&
				kase.code === code
			);
		});

		if (
			existingCase &&
			existingCase.kind === CaseKind.REPAIR_CODE_BY_TSC &&
			calculateSimilarity(
				existingCase.node,
				jobIngredient.classification.node,
			) > 0.5
		) {
			existingCase.jobHashes.add(job.hash);
			jobs.push(job);
			continue;
		}

		const partialCase = {
			kind: CaseKind.REPAIR_CODE_BY_TSC,
			subKind: jobIngredient.classification.subKind,
			code: stringifyCode(
				jobIngredient.enhancedDiagnostic.diagnostic.code,
			),

			node: jobIngredient.classification.node,
		};

		const caseHash = buildCaseHash(partialCase, job.hash);

		const kase: Case & { jobHashes: Set<JobHash> } = {
			hash: caseHash,
			jobHashes: new Set([job.hash]),
			...partialCase,
		};

		casesWithJobHashes.push(kase);
		jobs.push(job);
	}

	return {
		casesWithJobHashes,
		jobs,
	};
};
