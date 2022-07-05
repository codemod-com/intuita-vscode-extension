import {buildReorderDeclarationsUserCommand} from "./userCommandBuilder";
import {buildReorderDeclarationFact} from "./factBuilder";
import {buildReorderDeclarationsAstCommand} from "./astCommandBuilder";
import {executeReorderDeclarationsAstCommand} from "./astCommandExecutor";
import {SourceFileExecution} from "../../utilities";

export const reorderDeclarations = (
    fileName: string,
    fileText: string,
): ReadonlyArray<SourceFileExecution> => {
    const userCommand = buildReorderDeclarationsUserCommand(
        fileName,
        fileText,
    );

    const fact = buildReorderDeclarationFact(
        userCommand,
    );

    const astCommand = buildReorderDeclarationsAstCommand(
        userCommand,
        fact,
    );

    return executeReorderDeclarationsAstCommand(
        astCommand
    );
};