import {ClassDeclaration, Node} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

const enum ClassReferenceKind {
    IMPORT_SPECIFIER = 1,
}

type ClassReference =
    | Readonly<{
        kind: ClassReferenceKind.IMPORT_SPECIFIER,
        filePath: string;
    }>;

export const getClassReferences = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<ClassReference> => {
    return classDeclaration
        .findReferences()
        .flatMap((referencedSymbol) => referencedSymbol.getReferences())
        .map(
            (rse) => {
                const node = rse.getNode();
                const parentNode = node.getParent();

                console.log(parentNode?.getKindName())

                if (!parentNode || !Node.isImportSpecifier(parentNode)) {
                    return null;
                }

                const filePath = parentNode
                    .getSourceFile()
                    .getFilePath()
                    .toString();

                return {
                    kind: ClassReferenceKind.IMPORT_SPECIFIER,
                    filePath,
                };
            }
        )
        .filter(isNeitherNullNorUndefined);
};