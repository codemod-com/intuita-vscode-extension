import {Diagnostic} from "vscode";
import {buildHash} from "./utilities";

export type DiagnosticHash = string & { __type: 'DiagnosticHash' };

export const buildDiagnosticHash = (
    diagnostic: Diagnostic,
): DiagnosticHash => {
    return buildHash(
        [
            diagnostic.message,
            diagnostic.severity,
            diagnostic.source ?? '',
            String(diagnostic.range.start.line),
            String(diagnostic.range.start.character),
            String(diagnostic.range.end.line),
            String(diagnostic.range.end.character),
        ].join(',')
    ) as DiagnosticHash;
};
