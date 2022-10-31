import { assert } from "chai";
import { ReplacementEnvelope } from "../components/inferenceService";

const applyReplacementEnvelopes = (
    text: string,
    replacementEnvelopes: ReadonlyArray<ReplacementEnvelope>,
): string => {
    if (replacementEnvelopes.length === 0) {
        return text;
    }

    let newText: string = '';
    let shift: number = 0;

    for (const { range, replacement } of replacementEnvelopes) {
        newText = text.slice(0, range.start + shift) + replacement + text.slice(range.end + shift);

        shift += replacement.length - (range.end - range.start);
    }

    return newText;
};

describe.only('applyReplacementEnvelopes', () => {
    const oldText = '01234567890123456789012345678901234567890123456789';

    it('should do nothing for no replacement envelopes', () => {
        const newText = applyReplacementEnvelopes(oldText, []);

        assert.equal(newText, oldText);
        assert.equal(newText.length, 50);
    })

    it('should do one replacement with keeping the original length', () => {
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

    it('should do one replacement with shrinking the original length', () => {
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

    it('should do one replacement with expanding the original length', () => {
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
});