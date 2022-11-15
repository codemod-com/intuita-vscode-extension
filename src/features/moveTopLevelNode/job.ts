import { MoveTopLevelNodeUserCommand } from './1_userCommandBuilder';
import { MoveTopLevelNodeFact } from './2_factBuilders';
import {
	calculatePosition,
	IntuitaRange,
	isNeitherNullNorUndefined,
} from '../../utilities';
import { buildMoveTopLevelNodeJobHash } from './jobHash';
import { Solution } from './2_factBuilders/solutions';
import { JobKind, MoveTopLevelNodeJob } from '../../jobs/types';

const buildIdentifiersLabel = (
	identifiers: ReadonlyArray<string>,
	useHtml: boolean,
): string => {
	const label =
		identifiers.length > 1
			? `(${identifiers.join(' ,')})`
			: identifiers.join('');

	if (!useHtml) {
		return label;
	}

	return `<b>${label}</b>`;
};
export const buildTitle = (
	solution: Solution,
	useHtml: boolean,
): string | null => {
	const { nodes, newIndex } = solution;

	const node = nodes[newIndex];

	if (!node) {
		return null;
	}

	const nodeIdentifiersLabel = buildIdentifiersLabel(
		Array.from(node.identifiers),
		useHtml,
	);

	const otherNode = newIndex === 0 ? nodes[1] : nodes[newIndex - 1];

	if (!otherNode) {
		return null;
	}

	const orderLabel = newIndex === 0 ? 'before' : 'after';

	const otherIdentifiersLabel = buildIdentifiersLabel(
		Array.from(otherNode.identifiers),
		useHtml,
	);

	return `Move ${nodeIdentifiersLabel} ${orderLabel} ${otherIdentifiersLabel}`;
};

export const buildMoveTopLevelNodeJobs = (
	userCommand: MoveTopLevelNodeUserCommand,
	fact: MoveTopLevelNodeFact,
): ReadonlyArray<MoveTopLevelNodeJob> => {
	return fact.solutions
		.map((solution): MoveTopLevelNodeJob | null => {
			const { oldIndex, newIndex } = solution;

			const topLevelNode = fact.topLevelNodes[oldIndex] ?? null;

			if (topLevelNode === null) {
				return null;
			}

			const title = buildTitle(solution, false) ?? '';

			const start = calculatePosition(
				fact.separator,
				fact.lengths,
				topLevelNode.nodeStart,
			);

			const range: IntuitaRange = [
				start[0],
				start[1],
				start[0],
				fact.lengths[start[0]] ?? start[1],
			];

			const hash = buildMoveTopLevelNodeJobHash(
				userCommand.fileName,
				oldIndex,
				newIndex,
			);

			return {
				kind: JobKind.moveTopLevelNode,
				fileName: userCommand.fileName,
				hash,
				range,
				title,
				oldIndex,
				newIndex,
				score: solution.score,
				separator: fact.separator,
				stringNodes: fact.stringNodes,
				lengths: fact.lengths,
				topLevelNodes: fact.topLevelNodes,
				diagnosticHash: null,
			};
		})
		.filter(isNeitherNullNorUndefined);
};
