import * as t from 'io-ts'
import reporter from 'io-ts-reporters'
import {execSync, spawn} from "node:child_process";
import {ChildProcessWithoutNullStreams} from "child_process";
import {MessageBus, MessageKind} from "./messageBus";
import {Uri} from "vscode";
import {type} from "node:os";

export const buildTypeCodec = <T extends t.Props>(props: T): t.ReadonlyC<t.ExactC<t.TypeC<T>>> =>
    t.readonly(t.exact(t.type(props)));

export const decodeOrThrow = <A>(
    decoder: t.Decoder<unknown, A>,
    buildError: (report: ReadonlyArray<string>) => Error,
    i: unknown
): A => {
    const validation = decoder.decode(i)

    if (validation._tag === 'Left') {
        const report = reporter.report(validation);
        throw buildError(report);
    }

    return validation.right;
};

export const inferCommandCodec = buildTypeCodec({
    kind: t.literal('infer'),
    fileName: t.string,
    range: t.tuple([t.number, t.number, t.number, t.number ]),
    dimToFeature: t.any, // TODO what's the schema here?
    edges: t.any, // TODO what's the schema here?
    objects: t.any, // TODO what's the schema here?
    vectors: t.any, // TODO what's the schema here?
});

export const inferredMessageCodec = buildTypeCodec({
    kind: t.literal('inferred'),
    fileName: t.string,
    range: t.tuple([t.number, t.number, t.number, t.number ]),
    results: t.readonlyArray(t.string),
});

export const errorMessageCodec = buildTypeCodec({
    kind: t.literal('error'),
    description: t.string,
});

export type InferCommand = t.TypeOf<typeof inferCommandCodec>;

const areRepairCodeCommandsAvailable = () => {
    const operatingSystemName = type();

    if (operatingSystemName !== 'Linux' && operatingSystemName !== 'Darwin') {
        return false;
    }

    try {
        execSync('which joern-parse joern-vectors intuita-onnx-wrapper');

        return true;
    } catch {
        return false;
    }
};

export class InferenceService {
    protected readonly _messageBus: MessageBus;
    protected readonly _process: ChildProcessWithoutNullStreams | null;

    public constructor(
        messageBus: MessageBus
    ) {
        const commandsAvailable = areRepairCodeCommandsAvailable();

        this._messageBus = messageBus;

        this._process = commandsAvailable
            ? spawn('intuita-onnx-wrapper')
            : null;

        if (this._process) {
            this._process.stderr.on('data', (data) => {
                this._onStandardError(data);
            });

            this._process.stdout.on('data', (data) => {
                try {
                    this._onStandardOutput(data);
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }

    public async writeToStandardInput(
        command: InferCommand,
    ) {
        return new Promise<void>((resolve, reject) => {
            if (!this._process) {
                return resolve();
            }

            this._process.stdin.write(
                JSON.stringify(command),
                (error) => {
                    if (!error) {
                        return resolve();
                    }

                    return reject(error);
                },
            );
        });
    }

    public kill(): void {
        this._process?.kill();
    }

    protected _onStandardOutput(
        data: any,
    ): void {
        const str = data.toString();

        const json = JSON.parse(str);

        const message = decodeOrThrow(
            inferredMessageCodec,
            (report) =>
                new Error(`Could not decode the inferred message: ${report.join()}`),
            json
        );

        this._messageBus.publish({
            kind: MessageKind.createRepairCodeJob,
            uri: Uri.parse(message.fileName),
            range: message.range,
            replacement: message.results[0] ?? '',
        });
    }

    protected _onStandardError(
        data: any,
    ): void {
        const str = data.toString();
        const json = JSON.parse(str);

        const message = decodeOrThrow(
            errorMessageCodec,
            (report) =>
                new Error(`Could not decode the error message: ${report.join()}`),
            json
        );

        console.error(message.description);
    }
}
