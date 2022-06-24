import {ClassDeclaration, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export type InstanceMethod = Readonly<{
    name: string,
    calleeNames: ReadonlyArray<string>,
}>;

export const getClassInstanceMethods = (
    classDefinition: ClassDeclaration,
): ReadonlyArray<InstanceMethod> => {
    const oldMethods = classDefinition
        .getInstanceMethods()
        .map((methodDeclaration) => {
            const callerNames = methodDeclaration
                .findReferences()
                .flatMap((referencedSymbol) => referencedSymbol.getReferences())
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

                        return methodClassDeclaration === classDefinition;
                    }
                )
                .map((md) => md.getName());

            return {
                name: methodDeclaration.getName(),
                callerNames,
            };
        });

    // invert the relationship
    return oldMethods.map(
        ({ name }) => {
            const calleeNames: ReadonlyArray<string> = oldMethods
                .filter(({ callerNames }) => callerNames.includes(name))
                .map(({ name }) => name);

            return {
                name,
                calleeNames,
            };
        }
    );
};