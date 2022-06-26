import {lookupNode, NodeLookupCriterion} from "./nodeLookup";
import {Node, Project, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export const deleteNewExpressionVariableDeclaration = (
    project: Project,
    criterion: NodeLookupCriterion
): void => {
    lookupNode(project, criterion)
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
