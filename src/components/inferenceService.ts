import { left, Either, right } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import reporter from 'io-ts-reporters';

export const buildTypeCodec = <T extends t.Props>(
	props: T,
): t.ReadonlyC<t.ExactC<t.TypeC<T>>> => t.readonly(t.exact(t.type(props)));

export const mapValidationToEither = <A>(
	validation: t.Validation<A>,
): Either<string, A> => {
	if (validation._tag === 'Left') {
		return left(
			reporter.report(validation).toString(),
		)
	}

	return right(validation.right);
}

export const decodeOrThrow = <A>(
	decoder: t.Decoder<unknown, A>,
	buildError: (report: ReadonlyArray<string>) => Error,
	i: unknown,
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
	filePath: t.string,
	fileMetaHash: t.string,
	lineNumbers: t.readonlyArray(t.number), //0-indexed
});

export const inferenceJobCodec = t.union([
	buildTypeCodec({
		lineNumber: t.number,
		replacement: t.string,
	}),
	buildTypeCodec({
		range: t.readonly(t.tuple([t.number, t.number, t.number, t.number])),
		replacement: t.string,
	}),
]);

export const inferredMessageCodec = buildTypeCodec({
	kind: t.literal('inferred'),
	inferenceJobs: t.readonlyArray(inferenceJobCodec),
});

export type InferCommand = t.TypeOf<typeof inferCommandCodec>;
export type InferenceJob = t.TypeOf<typeof inferenceJobCodec>;
export type InferredMessage = t.TypeOf<typeof inferredMessageCodec>;
