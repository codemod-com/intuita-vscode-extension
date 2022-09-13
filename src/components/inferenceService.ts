import * as t from 'io-ts'
import reporter from 'io-ts-reporters'
import {execSync} from "node:child_process";
import {type} from "node:os";

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
    fileName: t.string,
    range: t.tuple([t.number, t.number, t.number, t.number ]),
    vectorPath: t.string,
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

export const areRepairCodeCommandsAvailable = () => {
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
