import * as vscode from 'vscode';
import {
	DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
	DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
	TopLevelNodeKind,
	TopLevelNodeModifier,
} from './features/moveTopLevelNode/2_factBuilders/topLevelNode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const kindOrder =
		configuration.get<ReadonlyArray<TopLevelNodeKind>>('kindOrder') ??
		DEFAULT_TOP_LEVEL_NODE_KIND_ORDER;

	const modifierOrder =
		configuration.get<ReadonlyArray<TopLevelNodeModifier>>(
			'modifierOrder',
		) ?? DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER;

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const minimumLines = configuration.get<number>('minimumLines') ?? 50;

	const preferRuleBasedCodeRepair =
		configuration.get<boolean>('preferRuleBasedCodeRepair') ?? false;

	const buildCodeRepairJobsOnDocumentSave =
		configuration.get<boolean>('buildCodeRepairJobsOnDocumentSave') ??
		false;

	return {
		modifierOrder,
		kindOrder,
		saveDocumentOnJobAccept,
		minimumLines,
		preferRuleBasedCodeRepair,
		buildCodeRepairJobsOnDocumentSave,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
