import {extractTypesFromTs2345ErrorMessage} from "../features/repairCode/extractTypesFromTs2345ErrorMessage";
import {assert} from "chai";

describe('extractTypesFromTs2345ErrorMessage', () => {
    it('should return string and number', () => {
        const types = extractTypesFromTs2345ErrorMessage(
            'Argument of type \'string\' is not assignable to parameter of type \'number\'.',
        );

        assert.equal(types.received, 'string');
        assert.equal(types.expected, 'number');
    });

    it('should return boolean and string', () => {
        const types = extractTypesFromTs2345ErrorMessage(
            'Argument of type \'boolean\' is not assignable to parameter of type \'string\'.',
        );

        assert.equal(types.received, 'boolean');
        assert.equal(types.expected, 'string');
    });
});
