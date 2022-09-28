import Axios, {CancelToken, CancelTokenSource} from 'axios';
import {buildDiagnosticHash, DiagnosticHash} from "../hashes";
import {decodeOrThrow, InferCommand, InferenceJob, inferredMessageCodec} from "./inferenceService";
import {DiagnosticChangeEvent, languages, Uri, window, workspace} from "vscode";
import {
    buildHash,
    buildIntuitaSimpleRange, calculateLengths,
    calculateLines,
    getSeparator, IntuitaRange,
    isNeitherNullNorUndefined
} from "../utilities";
import {basename, join} from "node:path";
import {mkdir, writeFile } from "node:fs";
import {promisify} from "node:util";
import {MessageBus, MessageKind} from "./messageBus";
import {Container} from "../container";
import {Configuration} from "../configuration";
import {extractKindsFromTs2345ErrorMessage} from "../features/repairCode/extractKindsFromTs2345ErrorMessage";

const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

export class DiagnosticManager {
    protected _counter: number = 0;
    protected readonly _hashes: Set<DiagnosticHash> = new Set();
    protected readonly _cancelTokenSourceMap: Map<string, CancelTokenSource> = new Map();

    public constructor(
        protected readonly _configurationContainer: Container<Configuration>,
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

    private _cancel(uri: Uri) {
        const stringUri = uri.toString();

        const cancelTokenSource = this._cancelTokenSourceMap.get(
            stringUri
        );

        if (!cancelTokenSource) {
            return;
        }

        this._cancelTokenSourceMap.delete(stringUri);

        cancelTokenSource.cancel();
    }

    protected _onTextDocumentChanged(uri: Uri): void {
        this.clearHashes();
        this._cancel(uri);
    }

    public async onDiagnosticChangeEvent(
        event: DiagnosticChangeEvent,
    ): Promise<void> {
        const {
            preferRuleBasedCodeRepair,
        } = this._configurationContainer.get();

        const counter = ++this._counter;

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

        this._cancel(uri);

        const {
            newDiagnostics,
            diagnosticNumber,
        } = this._getDiagnostics(uri, preferRuleBasedCodeRepair);

        if (!diagnosticNumber) {
            this._messageBus.publish({
                kind: MessageKind.noTypeScriptDiagnostics,
                uri,
            });

            return;
        }

        if (!newDiagnostics.length) {
            return;
        }

        const workspacePath = workspace.getWorkspaceFolder(uri)?.uri.fsPath;

        if (!isNeitherNullNorUndefined(workspacePath)) {
            return;
        }

        const text = getText();

        if (preferRuleBasedCodeRepair) {
            for (const diagnostic of newDiagnostics) {
                this._hashes.add(
                    buildDiagnosticHash(diagnostic)
                );
            }

            const separator = getSeparator(text);

            const lines = calculateLines(text, separator);
            const lengths = calculateLengths(lines);

            const inferenceJobs: ReadonlyArray<InferenceJob> = newDiagnostics.map(({ message, range }) => {
                const kinds = extractKindsFromTs2345ErrorMessage(message);

                if(!kinds) {
                    return null;
                }

                const intuitaRange: IntuitaRange = [
                    range.start.line,
                    range.start.character,
                    range.end.line,
                    range.end.character,
                ];

                const intuitaSimpleRange = buildIntuitaSimpleRange(
                    separator,
                    lengths,
                    intuitaRange,
                );

                const rangeText = text.slice(
                    intuitaSimpleRange.start,
                    intuitaSimpleRange.end,
                );

                return {
                    range: intuitaRange,
                    replacement: rangeText,
                };
            })
                .filter(isNeitherNullNorUndefined);

            this._messageBus.publish({
                kind: MessageKind.createRepairCodeJobs,
                uri,
                version,
                inferenceJobs,
            });

            return;
        }

        const fileBaseName = basename(stringUri);

        const hash = buildHash([
            stringUri,
            String(version),
            counter,
        ].join(','));

        const directoryPath = join(
            workspacePath,
            `/.intuita/${hash}/`,
        );

        const filePath = join(
            workspacePath,
            `/.intuita/${hash}/${fileBaseName}`,
        );

        const source = Axios.CancelToken.source();

        this._cancelTokenSourceMap.set(
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

        const lineNumbers = new Set(
            newDiagnostics.map(({ range }) => range.start.line)
        );

        const command: InferCommand = {
            kind: 'infer',
            fileMetaHash: hash,
            filePath: stringUri,
            lineNumbers: Array.from(lineNumbers),
            workspacePath,
        };

        const response = await this._infer(command, source.token);

        const message = decodeOrThrow(
            inferredMessageCodec,
            (report) =>
                new Error(`Could not decode the inferred message: ${report.join()}`),
            response.data,
        );

        for (const diagnostic of newDiagnostics) {
            this._hashes.add(
                buildDiagnosticHash(diagnostic)
            );
        }

        this._messageBus.publish({
            kind: MessageKind.createRepairCodeJobs,
            uri,
            version,
            inferenceJobs: message.inferenceJobs,
        });

        // TODO remove the .intuita / hash directory
    }

    protected _getDiagnostics(
        uri: Uri,
        preferRuleBasedCodeRepair: boolean,
    ) {
        const diagnostics = languages
            .getDiagnostics(uri)
            .filter(
                ({ source }) => source === 'ts'
            )
            .filter(
                ({ code }) => {
                    if(!preferRuleBasedCodeRepair) {
                        return true;
                    }

                    console.log(code);

                    return code === '2345' || code === 2345;
                }
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
