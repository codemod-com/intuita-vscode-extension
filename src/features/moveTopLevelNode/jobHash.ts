import { JobHash } from '../../jobs/types';
import { buildHash } from '../../utilities';

export const buildMoveTopLevelNodeJobHash = (
	fileName: string,
	oldIndex: number,
	newIndex: number,
): JobHash => {
	const data = {
		fileName,
		oldIndex,
		newIndex,
	};

	const hash = buildHash(JSON.stringify(data));

	return hash as JobHash;
};
