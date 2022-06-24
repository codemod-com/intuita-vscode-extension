import {ClassDeclaration, CommentStatement, Node, ts} from "ts-morph";

export const getClassCommentStatement = (
    classDeclaration: ClassDeclaration,
): CommentStatement | null => {
    const commentNode = classDeclaration
        .getPreviousSiblingIfKind(ts.SyntaxKind.SingleLineCommentTrivia);

    return Node.isCommentStatement(commentNode)
        ? commentNode
        : null;
};