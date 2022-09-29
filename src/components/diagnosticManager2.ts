import { Diagnostic, DiagnosticChangeEvent, languages, TextEditor, Uri } from "vscode";
import { buildHash } from "../utilities";
import { MessageBus, MessageKind } from "./messageBus";

export type DiagnosticHash = string & { __type: 'DiagnosticHash' };

const stringifyCode = (code: Diagnostic['code']): string => {
    if (code === undefined) {
        return '';
    }

    if (typeof code === 'string') {
        return code;
    }

    if (typeof code === 'number') {
        return String(code);
    }

    return [
        String(code.value),
        code.target.toString(),
    ].join(',');
};

export const buildDiagnosticHash = (
    uri: Uri,
    diagnostic: Diagnostic,
): DiagnosticHash => {
    return buildHash(
        [
            uri.toString(),
            String(diagnostic.range.start.line),
            String(diagnostic.range.start.character),
            String(diagnostic.range.end.line),
            String(diagnostic.range.end.character),
            diagnostic.message,
            diagnostic.severity,
            diagnostic.source ?? '',
            stringifyCode(diagnostic.code),
        ].join(',')
    ) as DiagnosticHash;
};


export class DiagnosticManager {
    protected readonly _seenHashes: Set<DiagnosticHash> = new Set();

    public constructor(
        protected readonly _getActiveTextEditor: () => TextEditor | null,
        protected readonly _messageBus: MessageBus,
    ) {

    }

    public async onDiagnosticChangeEvent(
        event: DiagnosticChangeEvent,
    ): Promise<void> {
        const activeTextEditor = this._getActiveTextEditor();

        if (!activeTextEditor) {
            console.debug('There is no active text editor despite the changed diagnostics.');

            return;
        }

        const { uri } = activeTextEditor.document;

        const stringUri = uri.toString();

        if (stringUri.includes('.intuita')) {
            console.debug('The files within the .intuita directory won\'t be inspected.');

            return;
        }

        if(!event.uris.some((u) => stringUri === u.toString())) {
            console.debug('No diagnostic have changed for the active text editor\'s document');

            return;
        }

        const diagnostics = languages
            .getDiagnostics(uri)
            .filter(
                ({ source }) => source === 'ts'
            )
            .filter(
                ({ code }) => {
                    if (!code) {
                        return false;
                    }

                    if (typeof code === 'string' || typeof code === 'number') {
                        return String(code) === '2345';
                    }

                    return String(code.value) === '2345';
                },
            );

        if(diagnostics.length === 0) {
            this._messageBus.publish({
                kind: MessageKind.noExternalDiagnostics,
                uri,
            });

            return;
        }

        const newDiagnostics = diagnostics.filter(
            (diagnostic) => {
                const hash = buildDiagnosticHash(uri, diagnostic);

                return !this._seenHashes.has(hash);
            }
        );

        if (newDiagnostics.length === 0) {
            return;
        }

        // newDiagnostics.map((diagnostic) => const hash = buildDiagnosticHash(uri, diagnostic);)

        this._messageBus.publish({
            kind: MessageKind.newExternalDiagnostics,
            uri,
            diagnostics: newDiagnostics,
        });
    }
}