import { InferenceJob } from "../../components/inferenceService";
import { Message, MessageKind } from "../../components/messageBus";
import { buildIntuitaSimpleRange, calculateLengths, calculateLines, getSeparator, IntuitaRange, isNeitherNullNorUndefined } from "../../utilities";
import { buildReplacement } from "./buildReplacement";
import { extractKindsFromTs2345ErrorMessage } from "./extractKindsFromTs2345ErrorMessage";

export const buildInferenceJobs = (
    message: Message & { kind: MessageKind.ruleBasedCoreRepairDiagnosticsChanged },
) : ReadonlyArray<InferenceJob> => {
    const separator = getSeparator(message.text);
    const lines = calculateLines(message.text, separator);
    const lengths = calculateLengths(lines);

    return message.diagnostics
        .map((diagnostic) => {
            const kinds = extractKindsFromTs2345ErrorMessage(diagnostic.message);

            if(!kinds) {
                return null;
            }

            const range: IntuitaRange = [
                diagnostic.range.start.line,
                diagnostic.range.start.character,
                diagnostic.range.end.line,
                diagnostic.range.end.character,
            ];

            const intuitaSimpleRange = buildIntuitaSimpleRange(
                separator,
                lengths,
                range,
            );

            const rangeText = message.text.slice(
                intuitaSimpleRange.start,
                intuitaSimpleRange.end,
            );

            const replacement = buildReplacement(rangeText, kinds.expected);

            return {
                range,
                replacement,
            };
        })
        .filter(isNeitherNullNorUndefined);
}   