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

    it('should change the 0 number into \'0\' string', () => {
        const replacement = buildReplacement({
            text: '\'\'',
            receivedKind: 'number',
            expectedKind: 'string',
        });

        assert.equal(replacement, '\'0\'');
    });

    it('should change the -123456789.123456789 number into \'-123456789.123456789\' string', () => {
        const replacement = buildReplacement({
            text: '-123456789.123456789',
            receivedKind: 'number',
            expectedKind: 'string',
        });

        assert.equal(replacement, '\'-123456789.123456789\'');
    });

    it('should change the 20 number into the \'20\' string', () => {
        const replacement = buildReplacement({
            text: '20',
            receivedKind: 'number',
            expectedKind: 'string',
        });

        assert.equal(replacement, '\'20\'');
    });

    it('should change the numberVariable number into the wrapper string', () => {
        const replacement = buildReplacement({
            text: 'numberVariable',
            receivedKind: 'number',
            expectedKind: 'string',
        });

        assert.equal(replacement, 'Number(numberVariable)');
    });
});