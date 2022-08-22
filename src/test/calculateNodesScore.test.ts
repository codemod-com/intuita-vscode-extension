import { assert } from "chai";
import { calculateNodesScore } from "../features/moveTopLevelNode/2_factBuilders/calculateNodesScore"
import { DEFAULT_TOP_LEVEL_NODE_KIND_ORDER, TopLevelNodeKind } from "../features/moveTopLevelNode/2_factBuilders/topLevelNode";

describe('calculateNodesScore', function() {
    it('should return 0 for an 0 elements', () => {
        const score = calculateNodesScore(
            [],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.equal(score, 0);
    });

    it('should return 0 for an array with 1 element', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.class,
                },
            ],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.equal(score, 0);
    });

    it('should return 0 for an array with 2 ordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.enum,
                },
                {
                    kind: TopLevelNodeKind.typeAlias,
                },
            ],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.equal(score, 0);
    });

    it('should return a positive number for an array with 2 unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.typeAlias,
                },
                {
                    kind: TopLevelNodeKind.enum,
                },
            ],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.approximately(score, 0.0625, 0.0001);
    });

    it('should return a positive number for an array with 2 unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.typeAlias,
                },
                {
                    kind: TopLevelNodeKind.enum,
                },
            ],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.approximately(score, 0.0625, 0.0001);
    });

    it('should return a positive number for an array with 2 unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.unknown,
                },
                {
                    kind: TopLevelNodeKind.enum,
                },
            ],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.approximately(score, 0.4375, 0.0001);
    });

    it('should return a positive number for an array with 3 unordered elements', () => {
        const score = calculateNodesScore(
            [
                {
                    kind: TopLevelNodeKind.unknown,
                },
                {
                    kind: TopLevelNodeKind.variable,
                },
                {
                    kind: TopLevelNodeKind.enum,
                },
            ],
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.approximately(score, 0.3125, 0.0001);
    });

    it('should return a positive number for an array with 8 unordered elements', () => {
        const nodes = DEFAULT_TOP_LEVEL_NODE_KIND_ORDER
            .slice()
            .reverse()
            .map(
                (kind) => ({
                    kind,
                }),
            );

        const score = calculateNodesScore(
            nodes,
            DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
        );

        assert.approximately(score, 0.2734, 0.0001);
    });
});