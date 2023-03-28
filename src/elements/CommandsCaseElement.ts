import { ElementHash, CommandElement } from './types';
export const buildCommandElement = (
	command: string,
	label: string,
): CommandElement => {
	return {
		kind: 'COMMAND' as const,
		hash: command as unknown as ElementHash,
		label,
		command,
	};
};
