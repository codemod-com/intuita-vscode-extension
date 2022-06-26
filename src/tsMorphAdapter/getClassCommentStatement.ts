import {ClassDeclaration, Node, ts} from "ts-morph";
import {buildNodeLookupCriterion, NodeLookupCriterion} from "./nodeLookup";

export const getClassCommentStatement = (
    classDeclaration: ClassDeclaration,
): NodeLookupCriterion | null => {
    const commentStatement = classDeclaration
        .getPreviousSiblingIfKind(ts.SyntaxKind.SingleLineCommentTrivia);

    if (!Node.isCommentStatement(commentStatement)) {
        return null;
    }

    const text = commentStatement.getText();

    return buildNodeLookupCriterion(
        commentStatement.compilerNode,
        (node) => {
            if (!Node.isCommentStatement(node)) {
                return true;
            }

            return node.getText() === text;
        }
    );
};