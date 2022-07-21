import {assert} from "chai";
import {tokenize} from "../tokenizer/tokenizer";

describe('tokenize', () => {
    it('test', () => {
        assert.deepEqual(tokenize(''), []);
    });

    it('A', () => {
        assert.deepEqual(tokenize('abc'), ['abc']);
    });

    it('B', () => {
        assert.deepEqual(tokenize('abcDef'), ['abc', 'def']);
    });

    it('c', () => {
        assert.deepEqual(tokenize('ABCDef'), ['abc', 'def']);
    });

    it('d', () => {
        assert.deepEqual(tokenize('abc def'), ['abc', 'def']);
    });

    it('e', () => {
        assert.deepEqual(tokenize('abc_def'), ['abc', 'def']);
    });
});