import {
    ClassDeclaration,
    ParameterDeclarationStructure,
    Scope,
    ts,
    TypeParameterDeclarationStructure
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {buildNodeLookupCriterion, NodeLookupCriterion} from "./nodeLookup";

export type InstanceMethod = Readonly<{
    name: string,
    typeParameters: ReadonlyArray<TypeParameterDeclarationStructure>,
    parameters: ReadonlyArray<ParameterDeclarationStructure>,
    returnType: string | null,
    calleeNames: ReadonlyArray<string>,
    bodyText: string | null,
    methodLookupCriteria: ReadonlyArray<NodeLookupCriterion>,
    scope: Scope,
}>;

export const getClassInstanceMethods = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<InstanceMethod> => {
    const oldMethods = classDeclaration
        .getInstanceMethods()
        .map((methodDeclaration) => {
            const typeParameters = methodDeclaration
                .getTypeParameters()
                .map((tpd) => tpd.getStructure());

            const parameters = methodDeclaration
                .getParameters()
                .map(parameter => parameter.getStructure());

            const returnType = methodDeclaration
                .getReturnTypeNode()
                ?.getText() ?? null;

            const bodyText = methodDeclaration.getBodyText() ?? null;

            const scope = methodDeclaration.getScope();

            const referencedSymbolEntries = methodDeclaration
                .findReferences()
                .flatMap((referencedSymbol) => referencedSymbol.getReferences())

            const callerNames = referencedSymbolEntries
                .map(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry
                            .getNode()
                            .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration);
                    }
                )
                .filter(isNeitherNullNorUndefined)
                .filter(
                    (otherMethodDeclaration) => {
                        if (otherMethodDeclaration === methodDeclaration) {
                            return false;
                        }

                        const methodClassDeclaration = otherMethodDeclaration
                            .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration);

                        return methodClassDeclaration === classDeclaration;
                    }
                )
                .map((md) => md.getName());

            const methodLookupCriteria = referencedSymbolEntries
                .filter(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry.getSourceFile() !== classDeclaration.getSourceFile()
                    }
                )
                .map(
                    (referencedSymbolEntry) => {
                        const node = referencedSymbolEntry
                            .getNode();

                        const kind = node.getKind();
                        const text = node.getText();

                        return buildNodeLookupCriterion(
                            node.compilerNode,
                            (node, index, length) => {
                                if (index !== (length-1)) {
                                    return true;
                                }

                                return node.getText() === text;
                            },
                        );
                    }
                );

            return {
                name: methodDeclaration.getName(),
                callerNames,
                typeParameters,
                parameters,
                returnType,
                bodyText,
                methodLookupCriteria,
                scope,
            };
        });

    // invert the relationship
    return oldMethods.map(
        (method) => {
            const calleeNames: ReadonlyArray<string> = oldMethods
                .filter(({ callerNames }) => callerNames.includes(method.name))
                .map(({ name }) => name);

            return {
                ...method,
                calleeNames,
            };
        }
    );
};