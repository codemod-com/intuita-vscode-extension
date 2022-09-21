import * as t from 'io-ts';
import reporter from 'io-ts-reporters';

export const buildTypeCodec = <T extends t.Props>(props: T): t.ReadonlyC<t.ExactC<t.TypeC<T>>> =>
    t.readonly(t.exact(t.type(props)));

export const decodeOrThrow = <A>(
    decoder: t.Decoder<unknown, A>,
    buildError: (report: ReadonlyArray<string>) => Error,
    i: unknown
): A => {
    const validation = decoder.decode(i);

    if (validation._tag === 'Left') {
        const report = reporter.report(validation);
        throw buildError(report);
    }

    return validation.right;
};

export const inferCommandCodec = buildTypeCodec({
    kind: t.literal('infer'),
    workspacePath: t.string,
    fileBaseName: t.string, // e.g. "index.ts"
    fileMetaHash: t.string,
    lineNumbers: t.readonlyArray(t.number), //0-indexed
});

export const inferenceJobCodec = buildTypeCodec({
    lineNumber: t.number,
    replacement: t.string,
});

export const inferredMessageCodec = buildTypeCodec({
    kind: t.literal('inferred'),
    inferenceJobs: t.readonlyArray(inferenceJobCodec),
});

export type InferCommand = t.TypeOf<typeof inferCommandCodec>;
export type InferenceJob = t.TypeOf<typeof inferenceJobCodec>;
export type InferredMessage = t.TypeOf<typeof inferredMessageCodec>;
