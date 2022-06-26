import {
    ClassDeclaration,
    Node,
    StatementedNode,
    ts,
    VariableDeclarationStructure,
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {buildNodeLookupCriterion, NodeLookupCriterion} from "./nodeLookup";

export enum ClassReferenceKind {
    IMPORT_SPECIFIER = 1,
    NEW_EXPRESSION = 3,
}

export type ClassReference =
    | Readonly<{
        kind: ClassReferenceKind.IMPORT_SPECIFIER,
        filePath: string;
    }>
    | Readonly<{
        kind: ClassReferenceKind.NEW_EXPRESSION,
        nodeLookupCriterion: NodeLookupCriterion,
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

                if (Node.isImportSpecifier(parentNode)) {
                    const filePath = parentNode
                        .getSourceFile()
                        .getFilePath()
                        .toString();

                    const classReference: ClassReference = {
                        kind: ClassReferenceKind.IMPORT_SPECIFIER,
                        filePath,
                    };

                    return classReference;
                }

                if (Node.isNewExpression(parentNode)) {
                    const nodeLookupCriterion = buildNodeLookupCriterion(
                        parentNode.getSourceFile(),
                        parentNode.compilerNode,
                        1,
                    );

                    const classReference: ClassReference = {
                        kind: ClassReferenceKind.NEW_EXPRESSION,
                        nodeLookupCriterion,
                    };

                    return classReference;
                }

                return null;
            }
        )
        .filter(isNeitherNullNorUndefined);
};