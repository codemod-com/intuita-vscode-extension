import {
    ClassDeclaration,
    Node,
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
        filePath: string,
    }>
    | Readonly<{
        kind: ClassReferenceKind.NEW_EXPRESSION,
        nodeLookupCriterion: NodeLookupCriterion,
        arguments: ReadonlyArray<string>,
        existingConstructor: boolean;
    }>;

export const getClassReferences = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<ClassReference> => {
    const existingConstructor = classDeclaration
        .getConstructors()
        .length !== 0;

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

                    return <ClassReference>{
                        kind: ClassReferenceKind.IMPORT_SPECIFIER,
                        filePath,
                    };
                }

                if (Node.isNewExpression(parentNode)) {
                    const _arguments = parentNode
                        .getArguments()
                        .map((node) => node.getText());

                    const text = parentNode.getText();

                    const nodeLookupCriterion = buildNodeLookupCriterion(
                        parentNode.compilerNode,
                        (node, index, length) => {
                            if(index !== (length-1) || !Node.isNewExpression(parentNode)) {
                                return true;
                            }

                            return node.getText() === text;
                        },
                    );

                    return <ClassReference>{
                        kind: ClassReferenceKind.NEW_EXPRESSION,
                        nodeLookupCriterion,
                        arguments: _arguments,
                        existingConstructor,
                    };
                }

                return null;
            }
        )
        .filter(isNeitherNullNorUndefined);
};