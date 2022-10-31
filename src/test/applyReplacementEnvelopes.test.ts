import { assert } from "chai";
import { ReplacementEnvelope } from "../components/inferenceService";

const applyReplacementEnvelopes = (
    text: string,
    replacementEnvelopes: ReadonlyArray<ReplacementEnvelope>,
): string => {
    let newText: string = text;
    let shift: number = 0;

    for (const { range, replacement } of replacementEnvelopes) {
        newText = newText.slice(0, range.start + shift) + replacement + newText.slice(range.end + shift);

        shift += replacement.length - (range.end - range.start);
    }

    return newText;
};

describe.only('applyReplacementEnvelopes', () => {
    const oldText = '01234567890123456789012345678901234567890123456789';

    it('should do 0 replacements for no replacement envelopes', () => {
        const newText = applyReplacementEnvelopes(oldText, []);

        assert.equal(newText, oldText);
        assert.equal(newText.length, 50);
    })

    it('should do 1 replacement with keeping the original length', () => {
        const replacement: ReplacementEnvelope = {
            range: {
                start: 10,
                end: 20,
            },
            replacement: 'abcdefghij'
        }

        const newText = applyReplacementEnvelopes(oldText, [ replacement ]);

        assert.equal(newText, '0123456789abcdefghij012345678901234567890123456789');
        assert.equal(newText.length, 50);
    })

    it('should do 1 replacement with shrinking the original length', () => {
        const replacement: ReplacementEnvelope = {
            range: {
                start: 10,
                end: 20,
            },
            replacement: 'abcde'
        }

        const newText = applyReplacementEnvelopes(oldText, [ replacement ]);

        assert.equal(newText, '0123456789abcde012345678901234567890123456789');
        assert.equal(newText.length, 45);
    });

    it('should do 1 replacement with expanding the original length', () => {
        const replacement: ReplacementEnvelope = {
            range: {
                start: 10,
                end: 20,
            },
            replacement: 'abcdefghijklmno'
        }

        const newText = applyReplacementEnvelopes(oldText, [ replacement ]);

        assert.equal(newText, '0123456789abcdefghijklmno012345678901234567890123456789');
        assert.equal(newText.length, 55);
    })

    it('should do empty 3 replacements with shrinking the original length', () => {
        const replacements: ReplacementEnvelope[] = [
            {
                range: {
                    start: 5,
                    end: 10,
                },
                replacement: ''
            },
            {
                range: {
                    start: 20,
                    end: 30,
                },
                replacement: ''
            },
            {
                range: {
                    start: 40,
                    end: 45,
                },
                replacement: ''
            }
        ]

        const newText = applyReplacementEnvelopes(oldText, replacements);

        assert.equal(newText, '012340123456789012345678956789');
        assert.equal(newText.length, 30);
    });
});