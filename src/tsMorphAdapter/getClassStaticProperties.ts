import {
    ClassDeclaration,
    StructureKind,
    ts
} from "ts-morph";
import { isNeitherNullNorUndefined } from "../utilities";
import {buildNodeLookupCriterion, NodeLookupCriterion} from "./nodeLookup";

type StaticProperty = Readonly<{
    name: string;
    initializer: string | null;
    readonly: boolean;
    references: ReadonlyArray<NodeLookupCriterion>;
}>;

export const getClassStaticProperties = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<StaticProperty> => {
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

                const references = staticProperty
                    .findReferences()
                    .flatMap((referencedSymbol) => referencedSymbol.getReferences())
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

                            const text = propertyAccessExpression.getText();

                            return buildNodeLookupCriterion(
                                propertyAccessExpression.compilerNode,
                                (node, index, length) => {
                                    if (index !== (length-1)) {
                                        return true;
                                    }

                                    return node.getText() === text;
                                }
                            );
                        }
                    )
                    .filter(isNeitherNullNorUndefined);

                return {
                    name,
                    initializer,
                    readonly,
                    references,
                };
            });
}