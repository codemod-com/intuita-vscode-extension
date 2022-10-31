import { CaseKind } from "../../cases/types";
import { Classification } from "../../classifier/types";
import { ReplacementEnvelope } from "../../components/inferenceService";
import { File } from "../../files/types";
import { buildIntuitaRangeFromSimpleRange } from "../../utilities";

export const buildTs2322NextJsImageLayoutReplacementEnvelope = (
    file: File,
    classification: Classification & { kind: CaseKind.TS2322_NEXTJS_IMAGE_LAYOUT },
): ReplacementEnvelope => {
    const start = classification.node.getFullStart();
    const end = classification.node.getEnd();

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