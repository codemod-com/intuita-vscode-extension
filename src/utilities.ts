import {
    PropertyAccessExpression,
    ReferencedSymbolEntry,
    SourceFile,
    ts,
} from "ts-morph";

export function isNeitherNullNorUndefined<T>(
    value: NonNullable<T> | null | undefined
): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

// to be removed
export const calculateStaticPropertyAccessExpressionUpdate = (
    referencedSymbolEntry: ReferencedSymbolEntry
): [SourceFile, PropertyAccessExpression] | null => {
    const sourceFile = referencedSymbolEntry.getSourceFile();
    const node = referencedSymbolEntry.getNode();

    const propertyAccessExpression = node
        .getFirstAncestorByKind(
            ts.SyntaxKind.PropertyAccessExpression
        );

    if(!propertyAccessExpression) {
        return null;
    }

    return [
        sourceFile,
        propertyAccessExpression,
        // () => propertyAccessExpression.replaceWithText(
        //     name
        // ),
    ];
}