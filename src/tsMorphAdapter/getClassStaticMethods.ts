import {ClassDeclaration, PropertyAccessExpression, SourceFile, StructureKind, ts} from "ts-morph";
import { isNeitherNullNorUndefined } from "../utilities";

type StaticMethod = Readonly<{
    name: string;
    initializer: string | null;
    readonly: boolean;
    // the following structure is tied to ts-morph for speed purposes
    propertyAccessExpressions: ReadonlyArray<
        Readonly<{
            sourceFile: SourceFile,
            propertyAccessExpression: PropertyAccessExpression,
        }>
    >
}>;

export const getClassStaticMethods = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<StaticMethod> => {
    return classDeclaration
        .getStaticProperties()
        .map(
            staticProperty => {
                const name = staticProperty.getName();

                const structure = staticProperty.getStructure();

                const initializer =
                    structure.kind === StructureKind.Property
                    ? structure.initializer?.toString() ?? null
                    : null;

                const modifierFlags = staticProperty.getCombinedModifierFlags();

                const readonly = Boolean(modifierFlags & ts.ModifierFlags.Readonly);

                const propertyAccessExpressions = staticProperty
                    .findReferences()
                    .flatMap((rs) => rs.getReferences())
                    .map(
                        (referencedSymbolEntry) => {
                            const sourceFile = referencedSymbolEntry.getSourceFile();
                            const node = referencedSymbolEntry.getNode();

                            const propertyAccessExpression = node
                                .getFirstAncestorByKind(
                                    ts.SyntaxKind.PropertyAccessExpression
                                );

                            if(!propertyAccessExpression) {
                                return null;
                            }

                            return {
                                sourceFile,
                                propertyAccessExpression,
                            };
                        }
                    )
                    .filter(isNeitherNullNorUndefined);

                return {
                    name,
                    initializer,
                    readonly,
                    propertyAccessExpressions,
                };
            });


}