import type { CallExpression } from "typescript";
import type { ReplacementEnvelope } from "../../components/inferenceService";
import type { File } from "../../files/types";
import { buildIntuitaRangeFromSimpleRange } from "../../utilities";
import { buildTs2769ObjectAssignReplacement } from "./buildReplacement";

export const buildTs2769ObjectAssignReplacementEnvelope = (
    file: File,
    node: CallExpression,
): ReplacementEnvelope => {
    const start = node.getStart();
    const end = node.getEnd();

    const range = buildIntuitaRangeFromSimpleRange(
        file.separator,
        file.lengths,
        { start, end },
    );

    const replacement = buildTs2769ObjectAssignReplacement(
        node.arguments,
    );

    return {
        range,
        replacement,
    };
}