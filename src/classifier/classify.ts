import * as ts from 'typescript';
import { IntuitaSimpleRange } from '../utilities';
import { CaseKind, Classification, ClassifierDiagnostic } from './types';

const isRangeWithinNode = (node: ts.Node, range: IntuitaSimpleRange) =>
    node.getFullStart() <= range.start && node.getEnd() >= range.end;

export const classify = (
	sourceFile: ts.SourceFile,
	diagnostic: ClassifierDiagnostic,
): Classification => {
    const otherClassification: Classification = {
		kind: CaseKind.OTHER,
		replacementRange: diagnostic.range,
	};

    console.log(diagnostic.code);

    if (diagnostic.code !== '2769') {
        return otherClassification;
    }

    const getNode = (node: ts.Node): ts.Node | null => {
        if (!isRangeWithinNode(node, diagnostic.range)) {
            return null;
        }

        const children = node.getChildren();

        if (children.length === 0) {
            return node;
        }

        for(const child of children) {
            const result = getNode(child);

            if (result !== null) {
                return result;
            }
        }

        return null;
    };

    const node = getNode(sourceFile);

    if (node === null) {
        return otherClassification;
    }

    if (ts.isCallExpression(node.parent)) {
        const callExpression = node.parent;
    }

    return otherClassification;
};
