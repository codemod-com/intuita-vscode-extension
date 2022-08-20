import { TopLevelNode } from "./topLevelNode";
import { buildTypeScriptTopLevelNodes } from "./typeScriptFactBuilder";

export const buildTopLevelNodes = (
    fileName: string,
    fileText: string,
): ReadonlyArray<TopLevelNode> => {
    if (
        fileName.endsWith('.js')
        || fileName.endsWith('.jsx')
        || fileName.endsWith('.ts')
        || fileName.endsWith('.tsx')
    ) {
        return buildTypeScriptTopLevelNodes(fileName, fileText);
    }

    return [];
};