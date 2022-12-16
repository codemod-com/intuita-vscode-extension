import * as t from 'io-ts';
import { CaseKind } from '../cases/types';
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

export const persistedCaseCodec = buildTypeCodec({
    kind: t.union([
        t.literal(CaseKind.REWRITE_FILE_BY_POLYGLOT_PIRANHA),
        t.literal(CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE),
        t.literal(CaseKind.REWRITE_FILE_BY_NORA_RUST_ENGINE),
    ]),
    subKind: t.string,
    hash: t.string,
});

export type PersistedCase = t.TypeOf<typeof persistedCaseCodec>;

export const persistedStateCodec = buildTypeCodec({
    cases: t.readonlyArray(persistedCaseCodec),
    jobs: t.readonlyArray(persistedJobCodec),
});

export type PersistedState = t.TypeOf<typeof persistedStateCodec>;