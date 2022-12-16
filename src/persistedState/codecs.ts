import * as t from 'io-ts';
import { JobKind } from '../jobs/types';
import { buildTypeCodec } from "../utilities";

export const persistedJobCodec = buildTypeCodec({
    kind: t.union([
        t.literal(JobKind.rewriteFile),
        t.literal(JobKind.createFile)
    ]),
    inputPath: t.string,
    outputPath: t.string,
    title: t.string,
    hash: t.string,
});

export type PersistedJob = t.TypeOf<typeof persistedJobCodec>;

export const persistedStateCodec = buildTypeCodec({
    jobs: t.readonlyArray(persistedJobCodec),
});

export type PersistedState = t.TypeOf<typeof persistedStateCodec>;