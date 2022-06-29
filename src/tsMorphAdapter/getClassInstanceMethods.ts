import {
    ClassDeclaration, DecoratorStructure, ExpressionStatement, GetAccessorDeclaration, MethodDeclaration,
    ParameterDeclarationStructure,
    Scope, SetAccessorDeclaration,
    ts,
    TypeParameterDeclarationStructure
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {buildNodeLookupCriterion, NodeLookupCriterion} from "./nodeLookup";

export type InstanceMethod = Readonly<{
    name: string,
    decorators: ReadonlyArray<DecoratorStructure>,
    typeParameters: ReadonlyArray<TypeParameterDeclarationStructure>,
    parameters: ReadonlyArray<ParameterDeclarationStructure>,
    returnType: string | null,
    calleeNames: ReadonlyArray<string>, // deprecated
    methodNames: ReadonlyArray<string>,
    setAccessorNames: ReadonlyArray<string>,
    getAccessorNames: ReadonlyArray<string>,
    bodyText: string | null,
    methodLookupCriteria: ReadonlyArray<NodeLookupCriterion>,
    scope: Scope,
    empty: boolean,
}>;

export const getClassInstanceMethods = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<InstanceMethod> => {
    const filterCallback = <T extends MethodDeclaration | SetAccessorDeclaration | GetAccessorDeclaration | ExpressionStatement>(
        declaration: T,
    ): boolean => {
        const otherClassDeclaration = declaration
            .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration);

        return otherClassDeclaration === classDeclaration;
    };

    const oldMethods = classDeclaration
        .getInstanceMethods()
        .map((methodDeclaration) => {
            const methodName = methodDeclaration.getName();

            const decorators = methodDeclaration
                .getDecorators()
                .map(decorator => decorator.getStructure());

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

            const setAccessorNames = referencedSymbolEntries
                .map(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry
                            .getNode()
                            .getFirstAncestorByKind(ts.SyntaxKind.SetAccessor);
                    }
                )
                .filter(isNeitherNullNorUndefined)
                .filter(filterCallback)
                .map((declaration) => declaration.getName())
                .filter(name => name !== methodName);

            const getAccessorNames = referencedSymbolEntries
                .map(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry
                            .getNode()
                            .getFirstAncestorByKind(ts.SyntaxKind.GetAccessor);
                    }
                )
                .filter(isNeitherNullNorUndefined)
                .filter(filterCallback)
                .map((declaration) => declaration.getName())
                .filter(name => name !== methodName);

            const callerNames = referencedSymbolEntries
                .map(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry
                            .getNode()
                            .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration);
                    }
                )
                .filter(isNeitherNullNorUndefined)
                .filter(filterCallback)
                .map((declaration) => declaration.getName())
                .filter(name => name !== methodName);

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

            const empty = bodyText === "";

            return {
                name: methodName,
                callerNames,
                methodNames: callerNames,
                setAccessorNames,
                getAccessorNames,
                typeParameters,
                parameters,
                returnType,
                bodyText,
                methodLookupCriteria,
                scope,
                empty,
                decorators,
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