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

    // test

    it('should change the 0 number into \'0\' string', () => {
        const replacement = buildReplacement({
            text: '0',
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

        assert.equal(replacement, 'String(numberVariable)');
    });

    /**
     * when we change a string into a boolean:
        if the string is a false or true literal, add quotes
        otherwise, use a wrapper
     */
    it('should change the \'false\' string into the false boolean', () => {
        const replacement = buildReplacement({
            text: '\'false\'',
            receivedKind: 'string',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'false');
    });

    it('should change the \'true\' string into the true boolean', () => {
        const replacement = buildReplacement({
            text: '\'true\'',
            receivedKind: 'string',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'true');
    });

    it('should change the "false" string into the false boolean', () => {
        const replacement = buildReplacement({
            text: '"false"',
            receivedKind: 'string',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'false');
    });

    it('should change the "true" string into the false boolean', () => {
        const replacement = buildReplacement({
            text: '"true"',
            receivedKind: 'string',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'true');
    });

    it('should change the stringVariable string into the wrapper boolean', () => {
        const replacement = buildReplacement({
            text: 'stringVariable',
            receivedKind: 'string',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'Boolean(stringVariable)');
    });

    /**
     * when we change a boolean into a string:
        if the boolean is false, make it 'false'
        if the boolean is true, make it 'true'
     */

    it('should change the false boolean into the "false" string', () => {
        const replacement = buildReplacement({
            text: 'false',
            receivedKind: 'boolean',
            expectedKind: 'string',
        });

        assert.equal(replacement, '\'false\'');
    });

    it('should change the true boolean into the "true" string', () => {
        const replacement = buildReplacement({
            text: 'true',
            receivedKind: 'boolean',
            expectedKind: 'string',
        });

        assert.equal(replacement, '\'true\'');
    });

    it('should change the booleanVariable boolean into the wrapped string', () => {
        const replacement = buildReplacement({
            text: 'booleanVariable',
            receivedKind: 'boolean',
            expectedKind: 'string',
        });

        assert.equal(replacement, 'String(booleanVariable)');
    });

    /**
     * when we change a number into a boolean

        if the number is the 0 literal, make it false

        if the number is another number literal, make it true

        otherwise, use a wrapper
     */

    it('should change the 0 number into the false boolean', () => {
        const replacement = buildReplacement({
            text: '0',
            receivedKind: 'number',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'false');
    });

    it('should change the -123456789.123456789 number into the true boolean', () => {
        const replacement = buildReplacement({
            text: '-123456789.123456789',
            receivedKind: 'number',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'true');
    });

    it('should change the numberVariable number into the wrapper boolean', () => {
        const replacement = buildReplacement({
            text: 'numberVariable',
            receivedKind: 'number',
            expectedKind: 'boolean',
        });

        assert.equal(replacement, 'Boolean(numberVariable)');
    });
});