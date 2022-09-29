import { Diagnostic } from "vscode";
import { InferenceJob } from "../../components/inferenceService";
import { buildIntuitaSimpleRange, calculateLengths, calculateLines, getSeparator, IntuitaRange, isNeitherNullNorUndefined } from "../../utilities";
import { buildReplacement } from "./buildReplacement";
import { extractKindsFromTs2345ErrorMessage } from "./extractKindsFromTs2345ErrorMessage";

export const buildInferenceJobs = (
    text: string,
    diagnostics: ReadonlyArray<Diagnostic>,
) : ReadonlyArray<InferenceJob> => {
    const separator = getSeparator(text);
    const lines = calculateLines(text, separator);
    const lengths = calculateLengths(lines);

    return diagnostics
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

            const rangeText = text.slice(
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