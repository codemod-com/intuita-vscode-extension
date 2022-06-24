import {ClassDeclaration, Node} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export const getClassImportSpecifierFilePaths = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<string> => {
    return classDeclaration
        .findReferences()
        .flatMap((referencedSymbol) => referencedSymbol.getReferences())
        .map(
            (rse) => {
                const node = rse.getNode();
                const parentNode = node.getParent();

                if (!parentNode || !Node.isImportSpecifier(parentNode)) {
                    return null;
                }

                return parentNode
                    .getSourceFile()
                    .getFilePath()
                    .toString();
            }
        )
        .filter(isNeitherNullNorUndefined);
};