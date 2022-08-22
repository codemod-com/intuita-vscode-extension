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

    it('should return 0 for an 0 elements', () => {
        const score = calculateNodesScore(
            [],
            kindOrder,
        );

        assert.equal(score, 0);
    });

    it('should return 0 for an array with 1 element', () => {
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

    it('should return 0 for an array with 2 ordered elements', () => {
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

    it('should return a positive number for an array with 2 unordered elements', () => {
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

    it('should return a positive number for an array with 2 unordered elements', () => {
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

    it('should return a positive number for an array with 2 unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.UNKNOWN,
                },
                {
                    kind: TopLevelNodeKind.ENUM,
                },
            ],
            kindOrder,
        );

        assert.approximately(score, 0.4375, 0.0001);
    });

    it('should return a positive number for an array with 3 unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.UNKNOWN,
                },
                {
                    kind: TopLevelNodeKind.VARIABLE,
                },
                {
                    kind: TopLevelNodeKind.ENUM,
                },
            ],
            kindOrder,
        );

        assert.approximately(score, 0.3125, 0.0001);
    });

    it('should return a positive number for an array with 8 unordered elements', () => {
        const nodes = kindOrder
            .slice()
            .reverse()
            .map(
                (kind) => ({
                    kind,
                }),
            );

        const score = calculateNodesScore(
            nodes,
            kindOrder,
        );

        assert.approximately(score, 0.2734, 0.0001);
    });
});