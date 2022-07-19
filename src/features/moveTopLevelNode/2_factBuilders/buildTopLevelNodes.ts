import { buildCTopLevelNodes } from "./cFactBuilder";
import { buildJavaTopLevelNodes } from "./javaFactBuilder";
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

    if (fileName.endsWith('.java')) {
        return buildJavaTopLevelNodes(fileText);
    }

    if (fileName.endsWith('.c')) {
        return buildCTopLevelNodes(fileText);
    }

    return [];
};