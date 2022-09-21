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
    fileName: t.string, // e.g. "index.ts"
    fileMetaHash: t.string,
    lineNumbers: t.readonlyArray(t.string), //0-indexed
});

export const replacementCodec = buildTypeCodec({
    lineNumber: t.string,
    text: t.string,
});

export const inferredMessageCodec = buildTypeCodec({
    kind: t.literal('inferred'),
    replacements: t.readonlyArray(replacementCodec),
});

export const errorMessageCodec = buildTypeCodec({
    kind: t.literal('error'),
    description: t.string,
});

export type InferCommand = t.TypeOf<typeof inferCommandCodec>;
