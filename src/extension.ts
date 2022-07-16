import * as vscode from 'vscode';
import {buildTitle, MoveTopLevelNodeActionProvider} from './actionProviders/moveTopLevelNodeActionProvider';
import { moveTopLevelNodeCommands } from './commands/moveTopLevelNodeCommands';
import {CancellationToken, Hover, Position, ProviderResult, TextDocument} from "vscode";
import {buildMoveTopLevelNodeUserCommand} from "./features/moveTopLevelNode/1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./features/moveTopLevelNode/2_factBuilders";
import {isNeitherNullNorUndefined} from "./utilities";

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new MoveTopLevelNodeActionProvider()
		));

	vscode.commands.registerCommand(
		'intuita.moveTopLevelNode',
		moveTopLevelNodeCommands,
	);

	vscode.languages.registerHoverProvider(
		'typescript',
		{
			provideHover(
				document: TextDocument,
				position: Position,
			): ProviderResult<Hover> {
				const fileName = document.fileName;
				const fileText = document.getText();
				const fileLine = position.line;
				const fileCharacter = position.character;

				const configuration = vscode.workspace.getConfiguration(
					'intuita',
				);

				const dependencyCoefficientWeight = configuration.get<number>('dependencyCoefficientWeight') ?? 1;
				const similarityCoefficientWeight = configuration.get<number>('similarityCoefficientWeight') ?? 1;
				const kindCoefficientWeight = configuration.get<number>('kindCoefficientWeight') ?? 1;

				const userCommand = buildMoveTopLevelNodeUserCommand(
					fileName,
					fileText,
					fileLine,
					fileCharacter,
					{
						dependencyCoefficientWeight,
						similarityCoefficientWeight,
						kindCoefficientWeight,
					},
				);

				const fact = buildMoveTopLevelNodeFact(userCommand);

				const solutions = fact
					.solutions
					.filter(
						(solution) => {
							return solution.newIndex !== solution.oldIndex;
						}
					);

				const solution = solutions[0] ?? null;

				if (solution === null) {
					return new vscode.Hover([]);
				}

				const { oldIndex, newIndex, nodes } = solution;

				const args = {
					fileName,
					oldIndex,
					newIndex,
					characterDifference: fact.characterDifference,
				};

				const encodedArgs = encodeURIComponent(JSON.stringify(args));
				const value = `command:intuita.moveTopLevelNode?${encodedArgs}`;

				const stageCommandUri = vscode.Uri.parse(value);
				const title = buildTitle(solution);

				const contents = new vscode.MarkdownString(
					`${title}\n\n[$(check)](${stageCommandUri}) $(close)`,
					true
				);
				contents.isTrusted = true;

				return new vscode.Hover(contents);
			}
		}
	)

	console.log('Activated the Intuita VSCode Extension')
}

// this method is called when your extension is deactivated
export function deactivate() {}
