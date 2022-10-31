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
		return left(reporter.report(validation).toString());
	}

	return right(validation.right);
};

export const replacementEnvelopeCodec = t.union([
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
	inferenceJobs: t.readonlyArray(replacementEnvelopeCodec),
});

export type ReplacementEnvelope = t.TypeOf<typeof replacementEnvelopeCodec>;
export type InferredMessage = t.TypeOf<typeof inferredMessageCodec>;
