import {MoveTopLevelNodeUserCommand} from "./userCommandBuilder";
import * as ts from "typescript";
import {createHash} from "crypto";
import {buildHash} from "../../utilities";

type TopLevelNode = Readonly<{
    id: string,
    start: number,
    end: number,
}>;

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
) => {
    const {
        fileName,
        fileText,
        fileLine,
    } = userCommand;

    const sourceFile = ts.createSourceFile(
        fileName,
        fileText,
        ts.ScriptTarget.ES5,
        true
    );

    const topLevelNodes = sourceFile
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.SyntaxList)
        .flatMap((node) => node.getChildren())
        .filter(node => {
            return ts.isClassDeclaration(node)
                || ts.isFunctionDeclaration(node)
                || ts.isInterfaceDeclaration(node)
                || ts.isInterfaceDeclaration(node)
                || ts.isTypeAliasDeclaration(node)
                || ts.isBlock(node)
                || ts.isVariableStatement(node);
        })
        .map((node) => {
            const start = node.getStart();
            const end = start + node.getWidth() - 1;

            const text = fileText.slice(start, end + 1);

            const id = buildHash(text);

            return {
                id,
                start,
                end,
            };
        });

    console.log(topLevelNodes);
};