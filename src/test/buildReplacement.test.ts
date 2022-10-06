import { assert } from "chai";
import { buildReplacement } from "../features/repairCode/buildReplacement";

describe('buildReplacement', () => {
    it('should change the \'20\' string into the 20 number', () => {
        const replacement = buildReplacement({
            text: '\'20\'',
            receivedKind: 'string',
            expectedKind: 'number',
        });

        assert.equal(replacement, '20');
    });

    it('should change the "20" string into the 20 number', () => {
        const replacement = buildReplacement({
            text: '"20"',
            receivedKind: 'string',
            expectedKind: 'number',
        });

        assert.equal(replacement, '20');
    });

    it('should change the stringVariable string into the wrapped number', () => {
        const replacement = buildReplacement({
            text: 'stringVariable',
            receivedKind: 'string',
            expectedKind: 'number',
        });

        assert.equal(replacement, 'Number(stringVariable)');
    });
});