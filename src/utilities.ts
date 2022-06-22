import {ReferencedSymbolEntry, SourceFile, ts} from "ts-morph";

export function isNeitherNullNorUndefined<T>(
    value: NonNullable<T> | null | undefined
): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export const calculateStaticPropertyAccessExpressionUpdate = (
    name: string,
    referencedSymbolEntry: ReferencedSymbolEntry
): [SourceFile, () => void] | null => {
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
        () => propertyAccessExpression.replaceWithText(
            name
        ),
    ];
}