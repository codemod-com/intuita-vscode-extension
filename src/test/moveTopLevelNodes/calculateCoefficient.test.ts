import {
    calculateCoefficient,
    calculateDependencyCoefficient
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