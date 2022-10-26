import type { RepairCodeJob } from '../../jobs/types';
import { calculateLines } from '../../utilities';

export const executeRepairCodeJob = (fact: RepairCodeJob) => {
	const previousCharacters = fact.fileText.slice(0, fact.simpleRange.start);

	const afterCharacters = fact.fileText.slice(fact.simpleRange.end);

	const text = previousCharacters.concat(fact.replacement, afterCharacters);

	const lines = calculateLines(previousCharacters, fact.separator);

	const line = lines.length;
	const character = lines[lines.length - 1]?.length ?? 0;

	return {
		text,
		line,
		character,
	};
};
