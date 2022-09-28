import {extractKindsFromTs2345ErrorMessage} from "../features/repairCode/extractKindsFromTs2345ErrorMessage";
import {assert} from "chai";
import {assertsNeitherNullOrUndefined} from "../utilities";

describe('extractTypesFromTs2345ErrorMessage', () => {
    it('should return string and number', () => {
        const kinds = extractKindsFromTs2345ErrorMessage(
            'Argument of type \'string\' is not assignable to parameter of type \'number\'.',
        );

        assertsNeitherNullOrUndefined(kinds);

        assert.equal(kinds.received, 'string');
        assert.equal(kinds.expected, 'number');
    });

    it('should return boolean and string', () => {
        const kinds = extractKindsFromTs2345ErrorMessage(
            'Argument of type \'boolean\' is not assignable to parameter of type \'string\'.',
        );

        assertsNeitherNullOrUndefined(kinds);

        assert.equal(kinds.received, 'boolean');
        assert.equal(kinds.expected, 'string');
    });
});
