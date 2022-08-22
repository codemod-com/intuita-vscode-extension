import { assert } from "chai";
import { calculateNodesScore } from "../features/moveTopLevelNode/2_factBuilders/calculateNodesScore"
import { TopLevelNodeKind } from "../features/moveTopLevelNode/2_factBuilders/topLevelNode";

describe('calculateNodesScore', function() {
    const kindOrder: ReadonlyArray<TopLevelNodeKind> = [
        TopLevelNodeKind.ENUM,
        TopLevelNodeKind.TYPE_ALIAS,
        TopLevelNodeKind.INTERFACE,
        TopLevelNodeKind.FUNCTION,
        TopLevelNodeKind.CLASS,
        TopLevelNodeKind.BLOCK,
        TopLevelNodeKind.VARIABLE,
        TopLevelNodeKind.UNKNOWN,
    ];

    it('should return 0 for an empty array', () => {
        const score = calculateNodesScore(
            [],
            kindOrder,
        );

        assert.equal(score, 0);
    });

    it('should return 0 for an array with one element', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.CLASS,
                },
            ],
            kindOrder,
        );

        assert.equal(score, 0);
    });

    it('should return 0 for an array with two ordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.ENUM,
                },
                {
                    kind: TopLevelNodeKind.TYPE_ALIAS,
                },
            ],
            kindOrder,
        );

        assert.equal(score, 0);
    });

    it('should return a positive number for an array with two unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.TYPE_ALIAS,
                },
                {
                    kind: TopLevelNodeKind.ENUM,
                },
            ],
            kindOrder,
        );

        assert.approximately(score, 0.0625, 0.0001);
    });
});