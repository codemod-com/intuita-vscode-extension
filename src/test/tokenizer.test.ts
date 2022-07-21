import {assert} from "chai";
import {tokenize} from "../tokenizer/tokenizer";

describe('tokenize', () => {
    it('should return an empty array for ""', () => {
        assert.deepEqual(tokenize(''), []);
    });

    it('should return a single-element array for "abc"', () => {
        assert.deepEqual(tokenize('abc'), ['abc']);
    });

    it('should return a two-element array for "abcDef"', () => {
        assert.deepEqual(tokenize('abcDef'), ['abc', 'def']);
    });

    it('should return a two-element array for "ABCDef"', () => {
        assert.deepEqual(tokenize('ABCDef'), ['abc', 'def']);
    });

    it('should return a two-element array for "abc def"', () => {
        assert.deepEqual(tokenize('abc def'), ['abc', 'def']);
    });

    it('should return a two-element array for "abc_def"', () => {
        assert.deepEqual(tokenize('abc_def'), ['abc', 'def']);
    });
});