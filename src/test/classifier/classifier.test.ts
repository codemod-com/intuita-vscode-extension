import { readFileSync } from "fs";
import { join } from "path";
// import { Diagnostic, Position, Range } from "vscode";
import type { ClassifierDiagnostic } from "../../classifier/types";

describe.only('Classifier', () => {
    it('should classify correctly', () => {
        // const code = readFileSync(join(__dirname, './code.txt')).toString('utf8');

        const entries: any[] = JSON.parse(readFileSync(join(__dirname, './diagnostics.txt')).toString('utf8'));

        const diagnostics = entries.map(
            (entry): ClassifierDiagnostic => {
                return {
                    code: entry.code,
                    message: entry.message,
                    range: [
                        entry.startLineNumber,
                        entry.startColumnNumber,
                        entry.endLineNumber,
                        entry.endColumnNumber,
                    ],
                }

                // const diagnostic = new Diagnostic(
                //     new Range(
                //         new Position(entry.startLineNumber, entry.startColumnNumber),
                //         new Position(entry.endLineNumber, entry.endColumnNumber),
                //     ),
                //     entry.message,
                // );

                // diagnostic.code = entry.code;
                // diagnostic.source = entry.source;
                // diagnostic.severity = entry.severity;

                // return diagnostic;
            }
        );

        console.log(diagnostics);
    });
})