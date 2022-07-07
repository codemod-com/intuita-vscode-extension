import {
    calculateCoefficient,
    calculateDependencyCoefficient, calculateSimilarityCoefficient
} from "../../features/moveTopLevelNode/3_astCommandBuilder";
import {assert} from "chai";
import { TopLevelNode } from "../../features/moveTopLevelNode/2_factBuilder";

const buildNode = (
    identifier: string,
    childIdentifiers: ReadonlySet<string>,
): TopLevelNode => {
    return {
        id: identifier,
        start: 0,
        end: 10,
        identifiers: new Set([ identifier ]),
        childIdentifiers,
    };
};

describe('calculateDependencyCoefficient', () => {
    it('should return 0 for 0 nodes', () => {
        const coefficient = calculateDependencyCoefficient([]);

        assert.approximately(coefficient, 0, 0.0001);
    });

    it('should return 0 for 2 nodes (no dependency)', () => {
        const coefficient = calculateDependencyCoefficient([
            buildNode('a', new Set([])),
            buildNode('b', new Set([])),
        ]);

        assert.approximately(coefficient, 0, 0.0001);
    });

    it('should return 0.5 for 2 nodes (one depends on the other)', () => {
        const coefficient = calculateDependencyCoefficient([
            buildNode('a', new Set(['b'])),
            buildNode('b', new Set([])),
        ]);

        assert.approximately(coefficient, 0.5, 0.0001);
    });

    it('should return 0 for 2 nodes (one depends on the other)', () => {
        const coefficient = calculateDependencyCoefficient([
            buildNode('a', new Set([''])),
            buildNode('b', new Set(['a'])),
        ]);

        assert.approximately(coefficient, 0, 0.0001);
    });
});

describe('calculateSimilarityCoefficient', () => {
    it('should return 0 for 0 nodes', () => {
        const coefficient = calculateSimilarityCoefficient([]);

        assert.approximately(coefficient, 0, 0.0001);
    });

    it('should return 1 for 3 nodes (no dependency)', () => {
        const coefficient = calculateSimilarityCoefficient([
            buildNode('a', new Set([])),
            buildNode('b', new Set([])),
            buildNode('c', new Set([])),
        ]);

        assert.approximately(coefficient, 1, 0.0001);
    });

    it('should return 0 for 3 nodes (exact names)', () => {
        const coefficient = calculateSimilarityCoefficient([
            buildNode('test', new Set([])),
            buildNode('test', new Set([])),
            buildNode('test', new Set([])),
        ]);

        assert.approximately(coefficient, 0.08, 0.01);
    });

    it('should return 0.33 for 3 nodes (a half of every word matches)', () => {
        const coefficient = calculateSimilarityCoefficient([
            buildNode('ta', new Set([])),
            buildNode('tb', new Set([])),
            buildNode('tc', new Set([])),
        ]);

        assert.approximately(coefficient, 0.33, 0.01);
    });

    it('should return 0.33 for 3 nodes (80% of every word matches)', () => {
        const coefficient = calculateSimilarityCoefficient([
            buildNode('testa', new Set([])),
            buildNode('testb', new Set([])),
            buildNode('testc', new Set([])),
        ]);

        assert.approximately(coefficient, 0.08, 0.01);
    });

    it('should return 0.78 for 3 nodes (no real matches)', () => {
        const coefficient = calculateSimilarityCoefficient([
            buildNode('function', new Set([])),
            buildNode('class', new Set([])),
            buildNode('method', new Set([])),
        ]);

        assert.approximately(coefficient, 0.78, 0.01);
    });
});