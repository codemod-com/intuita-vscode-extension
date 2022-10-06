import { assert } from "chai";
import { buildReplacement } from "../features/repairCode/buildReplacement";

describe.only('buildReplacement', () => {
    it('should change the \'\' string into the 0 number', () => {
        const replacement = buildReplacement({
            text: '\'\'',
            receivedKind: 'string',
            expectedKind: 'number',
        });

        assert.equal(replacement, '0');
    });

    it('should change the \'-123456789.12345678\' string into the number', () => {
        const replacement = buildReplacement({
            text: '\'-123456789.12345678\'',
            receivedKind: 'string',
            expectedKind: 'number',
        });

        assert.equal(replacement, '-123456789.12345678');
    });

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