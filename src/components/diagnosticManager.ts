import Axios, {CancelToken, CancelTokenSource} from 'axios';
import {buildDiagnosticHash, DiagnosticHash} from "../hashes";
import { decodeOrThrow, InferCommand, inferredMessageCodec} from "./inferenceService";
import {DiagnosticChangeEvent, languages, Uri, window, workspace} from "vscode";
import {buildHash, isNeitherNullNorUndefined} from "../utilities";
import {join} from "node:path";
import {mkdir, writeFile } from "node:fs";
import {promisify} from "node:util";
import {MessageBus, MessageKind} from "./messageBus";

const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

export class DiagnosticManager {
    protected readonly _hashes: Set<DiagnosticHash> = new Set();
    protected readonly _abortControllerMap: Map<string, CancelTokenSource> = new Map();

    public constructor(
        protected readonly _messageBus: MessageBus,
    ) {
        this._messageBus.subscribe(
            (message) => {
                if (message.kind === MessageKind.textDocumentChanged) {
                    setImmediate(
                        () => {
                            this._onTextDocumentChanged(message.uri);
                        },
                    );
                }
            },
        );
    }

    public clearHashes() {
        this._hashes.clear();
    }

    private _abort(uri: Uri) {
        const stringUri = uri.toString();

        const abortController = this._abortControllerMap.get(
            stringUri
        );

        if (!abortController) {
            return;
        }

        this._abortControllerMap.delete(stringUri);

        abortController.cancel();
    }

    protected _onTextDocumentChanged(uri: Uri): void {
        this.clearHashes();
        this._abort(uri);
    }

    public async onDiagnosticChangeEvent(
        event: DiagnosticChangeEvent,
    ): Promise<void> {
        const { activeTextEditor } = window;

        if (!activeTextEditor) {
            console.error('There is no active text editor despite the changed diagnostics.');

            return;
        }

        const { uri, version, getText } = activeTextEditor.document;

        const stringUri = uri.toString();

        if (stringUri.includes('.intuita')) {
            console.log('The files within the .intuita directory won\'t be inspected.');

            return;
        }

        if(!event.uris.some((u) => stringUri === u.toString())) {
            return;
        }

        this._abort(uri);

        const {
            newDiagnostics,
            diagnosticNumber,
        } = this._getDiagnostics(uri);

        if (!diagnosticNumber) {
            this._messageBus.publish({
                kind: MessageKind.noTypeScriptDiagnostics,
                uri,
            });

            return;
        }

        const workspacePath = workspace.getWorkspaceFolder(uri)?.uri.fsPath;

        if (!isNeitherNullNorUndefined(workspacePath)) {
            return;
        }

        const text = getText();

        const hash = buildHash([
            stringUri,
            String(version),
        ].join(','));

        const directoryPath = join(
            workspacePath,
            `/.intuita/${hash}/`,
        );

        const filePath = join(
            workspacePath,
            `/.intuita/${hash}/index.ts`,
        );

        const source = Axios.CancelToken.source();

        this._abortControllerMap.set(
            stringUri,
            source,
        );

        await promisifiedMkdir(
            directoryPath,
            {
                recursive: true,
            },
        );

        await promisifiedWriteFile(
            filePath,
            text,
            {
                encoding: 'utf8',
            },
        );

        const lineNumbers = newDiagnostics
            .map(({ range }) => String(range.start.line));

        const command: InferCommand = {
            kind: 'infer',
            fileMetaHash: hash,
            fileName: "", // TODO
            lineNumbers,
            workspacePath,
        };

        for (const diagnostic of newDiagnostics) {
            this._hashes.add(
                buildDiagnosticHash(diagnostic)
            );
        }

        const response = await this._infer(command, source.token);

        const message = decodeOrThrow(
            inferredMessageCodec,
            (report) =>
                new Error(`Could not decode the inferred message: ${report.join()}`),
            response.data,
        );

        // TODO rename the message kind to createRepairCodeJobs
        this._messageBus.publish({
            kind: MessageKind.createRepairCodeJob,
            uri,
            range: message.range,
            replacement: message.results[0] ?? '',
            version,
        });

        // TODO remove the .intuita / hash directory
    }

    protected _getDiagnostics(uri: Uri) {
        const diagnostics = languages
            .getDiagnostics(uri)
            .filter(
                ({ source }) => source === 'ts'
            );

        return {
            newDiagnostics: diagnostics.filter(
                (diagnostic) => !this._hashes.has(
                    buildDiagnosticHash(diagnostic)
                )
            ),
            diagnosticNumber: diagnostics.length,
        };
    }

    protected async _infer(
        command: InferCommand,
        cancelToken: CancelToken,
    ) {
        try {
            return await Axios.post(
                'http://localhost:4000/infer',
                command,
                {
                    cancelToken,
                },
            );
        } catch (error) {
            if (Axios.isAxiosError(error)) {
                console.error(error.response?.data);
            }

            throw error;
        }
    }
}
