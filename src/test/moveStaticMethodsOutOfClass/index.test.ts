import {assert} from "chai";
import {applyChanges} from "../utilities";

describe('applyClassSplitCommand', () => {
    it('should apply the split command', () => {
        const {
            sourceFiles,
            sourceFileText3,
        } = applyChanges(__dirname)

        assert.equal(
            sourceFiles[0]![1],
            sourceFileText3
        );
    });
});