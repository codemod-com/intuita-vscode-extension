import { JsxAttribute } from "typescript";
import { ReplacementEnvelope } from "../../components/inferenceService";
import { File } from "../../files/types";
import { buildIntuitaRangeFromSimpleRange } from "../../utilities";

export const buildTs2322NextJsImageLayoutReplacementEnvelope = (
    file: File,
    node: JsxAttribute,
): ReplacementEnvelope => {
    const start = node.getFullStart();
    const end = node.getEnd();

    const range = buildIntuitaRangeFromSimpleRange(
        file.separator,
        file.lengths,
        { start, end },
    );

    return {
        range,
        replacement: '',
    };
}