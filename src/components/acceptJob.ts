import { JobHash } from '../features/moveTopLevelNode/jobHash';
import { JobManager } from './jobManager';

export const acceptJob = (jobManager: JobManager) => {
	return async (arg0: unknown, arg1: unknown) => {
		// factor in tree-data commands and regular commands
		const jobHash = typeof arg0 === 'string'
			? arg0
			: null;

		if (jobHash === null) {
			throw new Error(
				`Could not decode the first positional arguments: it should have been a string`,
			);
		}

		const characterDifference = typeof arg1 === 'number'
			? arg1
			: 0;

		jobManager.acceptJob(
			jobHash as JobHash,
			characterDifference,
		);		
	};
};
