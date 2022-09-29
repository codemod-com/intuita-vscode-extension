import { Diagnostic, DiagnosticChangeEvent, TextEditor, Uri } from "vscode";
import { buildHash } from "../utilities";
import { MessageBus, MessageKind } from "./messageBus";

type DiagnosticHash = string & { __type: 'DiagnosticHash' };

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

const buildDiagnosticHash = (
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
        protected readonly _getDiagnostics: (uri: Uri) => ReadonlyArray<Diagnostic>,
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

        const { uri, getText } = activeTextEditor.document;

        const stringUri = uri.toString();

        if (stringUri.includes('.intuita')) {
            console.debug('The files within the .intuita directory won\'t be inspected.');

            return;
        }

        if(!event.uris.some((u) => stringUri === u.toString())) {
            console.debug('No diagnostic have changed for the active text editor\'s document');

            return;
        }

        const diagnostics = this._getDiagnostics(uri)
            .filter(
                ({ source, code }) => {
                    if (source !== 'ts' || !code) {
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

        const newDiagnostics: Diagnostic[] = [];

        diagnostics.forEach(
            (diagnostic) => {
                const hash = buildDiagnosticHash(uri, diagnostic);

                if (this._seenHashes.has(hash)) {
                    return;
                }

                this._seenHashes.add(hash);

                newDiagnostics.push(diagnostic);
            }
        )

        if (newDiagnostics.length === 0) {
            return;
        }

        const text = getText();

        this._messageBus.publish({
            kind: MessageKind.newExternalDiagnostics,
            uri,
            text,
            diagnostics: newDiagnostics,
        });
    }
}