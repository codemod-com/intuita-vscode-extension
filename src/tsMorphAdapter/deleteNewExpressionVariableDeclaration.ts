import {lookupNode, NodeLookupCriterion} from "./nodeLookup";
import {Node, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export const deleteNewExpressionVariableDeclaration = (
    criterion: NodeLookupCriterion
): void => {
    lookupNode(criterion)
        .filter(Node.isNewExpression)
        .map(
            (newExpression) =>
                newExpression.getFirstAncestorByKind(ts.SyntaxKind.VariableDeclaration)
        )
        .filter(isNeitherNullNorUndefined)
        .forEach(
            (variableDeclaration) => {
                variableDeclaration.remove();
            }
        );
};
