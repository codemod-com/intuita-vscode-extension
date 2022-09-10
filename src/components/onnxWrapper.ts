import * as t from 'io-ts'
import reporter from 'io-ts-reporters'
import {areRepairCodeCommandAvailable} from "../configuration";
import {spawn} from "node:child_process";
import {ChildProcessWithoutNullStreams} from "child_process";
import {MessageBus, MessageKind} from "../messageBus";
import {Uri} from "vscode";
import {IntuitaRange} from "../utilities";

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

export const exitCommandCodec = buildTypeCodec({
    kind: t.literal('exit'),
});

export const inferCommandCodec = buildTypeCodec({
    kind: t.literal('infer'),
    fileName: t.string,
    range: t.tuple([t.number, t.number, t.number, t.number ]),
    dimToFeature: t.any, // TODO what's the schema here?
    edges: t.any,
    objects: t.any, // TODO what's the schema here?
    vectors: t.any, // TODO what's the schema here?
});

export const commandCodec = t.union([exitCommandCodec, inferCommandCodec]);

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

export type Command = t.TypeOf<typeof commandCodec>;
export type InferredMessage = t.TypeOf<typeof inferredMessageCodec>;
export type ErrorMessage = t.TypeOf<typeof errorMessageCodec>;

export class OnnxWrapper {
    protected readonly _messageBus: MessageBus;
    protected readonly _process: ChildProcessWithoutNullStreams | null;

    public constructor(
        messageBus: MessageBus
    ) {
        const commandsAvailable = areRepairCodeCommandAvailable();

        this._messageBus = messageBus;

        this._process = commandsAvailable
            ? spawn('intuita-onnx-wrapper')
            : null;

        if (this._process) {
            this._process.stderr.on('data', (data) => {
                this._onStandardError(data);
            });

            this._process.stdout.on('data', (data) => {
                console.log(data.toString());
            });
        }
    }

    public writeToStandardInput() {

    }

    protected _onStandardOutput(
        data: any,
    ): void {
        const str = data.toString()
        const json = JSON.parse(str);

        const message = decodeOrThrow(
            inferredMessageCodec,
            () => new Error(''), // TODO fix
            json
        );

        this._messageBus.publish({
            kind: MessageKind.createRepairCodeJob,
            uri: Uri.file(message.fileName), // TODO we need to check if this is correct
            range: message.range,
            replacement: message.results[0] ?? '',
        });
    }

    protected _onStandardError(
        data: any,
    ): void {
        const str = data.toString()
        const json = JSON.parse(str);

        const message = decodeOrThrow(
            errorMessageCodec,
            () => new Error(''), // TODO fix
            json
        );

        console.error(message.description);
    }
}
