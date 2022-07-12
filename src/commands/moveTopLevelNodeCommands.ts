import * as vscode from 'vscode';
import { buildTopLevelNodes } from "../features/moveTopLevelNode/2_factBuilders/buildTopLevelNodes";
import { getStringNodes } from "../features/moveTopLevelNode/2_factBuilders/stringNodes";
import { executeMoveTopLevelNodeAstCommand } from "../features/moveTopLevelNode/4_astCommandExecutor";

export const moveTopLevelNodeCommands = async (args: any) => {
    const fileName: string | null = args && typeof args.fileName === 'string'
        ? args.fileName
        : null;

    const oldIndex: number | null = args && typeof args.oldIndex === 'number'
        ? args.oldIndex
        : null;

    const newIndex: number | null = args && typeof args.newIndex === 'number'
        ? args.newIndex
        : null;

    const activeTextEditor = vscode.window.activeTextEditor ?? null;

    if (
        fileName === null
        || oldIndex === null
        || newIndex === null
        || activeTextEditor === null
        || activeTextEditor.document.fileName !== fileName
    ) {
        return;
    }

    const fileText = activeTextEditor.document.getText();

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const executions = executeMoveTopLevelNodeAstCommand({
        kind: "MOVE_TOP_LEVEL_NODE",
        fileName,
        oldIndex,
        newIndex,
        stringNodes,
    });

    const execution = executions[0] ?? null;

    if (!execution) {
        return;
    }

    const { name, text, lineNumber } = execution;

    if (name !== fileName) {
        return;
    }

    const oldLines = fileText.split('\n');
    const oldTextLastLineNumber = oldLines.length - 1;
    const oldTextLastCharacter = oldLines[oldLines.length - 1]?.length ?? 0;

    const range = new vscode.Range(
        new vscode.Position(
            0,
            0
        ),
        new vscode.Position(
            oldTextLastLineNumber,
            oldTextLastCharacter
        ),
    );

    await activeTextEditor.edit(
        (textEditorEdit) => {
            textEditorEdit.replace(
                range,
                text,
            );
        }
    );

    const position = new vscode.Position(lineNumber, 0);
    const selection = new vscode.Selection(position, position);
    
    activeTextEditor.selections = [ selection ];
}