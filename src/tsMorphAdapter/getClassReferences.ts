import {ClassDeclaration, Node, Statement, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export enum ClassReferenceKind {
    IMPORT_SPECIFIER = 1,
    VARIABLE_STATEMENT = 2
}

export type ClassReference =
    | Readonly<{
        kind: ClassReferenceKind.IMPORT_SPECIFIER,
        filePath: string;
    }>
    | Readonly<{
        kind: ClassReferenceKind.VARIABLE_STATEMENT,
        statement: Statement,
        declarations: ReadonlyArray<
            Readonly<{
                name: string,
            }>
        >
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
                    // TODO it assumes that it's just "const x = new A();"
                    const variableStatement = parentNode
                        .getFirstAncestorByKind(ts.SyntaxKind.VariableStatement);

                    if (!variableStatement) {
                        return null;
                    }

                    const maybeStatementedBlock = variableStatement.getParent();

                    if(!Node.isStatement(maybeStatementedBlock)) {
                        return null;
                    }

                    const declarations = variableStatement.getDeclarations().map(
                        (variableDeclaration) => {
                            const name = variableDeclaration.getName();

                            return {
                                name,
                            };
                        }
                    );

                    const classReference: ClassReference = {
                        kind: ClassReferenceKind.VARIABLE_STATEMENT,
                        statement: maybeStatementedBlock,
                        declarations,
                    };

                    return classReference;
                }

                return null;
            }
        )
        .filter<ClassReference>(isNeitherNullNorUndefined);
};