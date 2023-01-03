import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';

export const TELEMETRY_MESSAGE_KINDS = {
    EXTENSION_ACTIVATED: "1" as const,
    EXTENSION_DEACTIVATED: "2" as const,
    CODEMOD_SET_EXECUTION_BEGAN: "3" as const,
    CODEMOD_SET_EXECUTION_HALTED: "4" as const,
    CODEMOD_SET_EXECUTION_ENDED: "5" as const,
    JOBS_CREATED: "6" as const,
    JOB_UPDATED: "7" as const,
    JOBS_ACCEPTED: "8" as const,
    JOBS_REJECTED: "9" as const,
}

export const telemetryMessageCodec = t.union([
    buildTypeCodec({
        kind: t.literal(TELEMETRY_MESSAGE_KINDS.EXTENSION_ACTIVATED),
        sessionId: t.string,
        happenedAt: t.string,
    }),
    buildTypeCodec({
        kind: t.literal(TELEMETRY_MESSAGE_KINDS.EXTENSION_DEACTIVATED),
        sessionId: t.string,
        happenedAt: t.string,
    }),
    buildTypeCodec({
        kind: t.union([
            t.literal(TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_BEGAN),
            t.literal(TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_HALTED),
        ]),
        sessionId: t.string,
        happenedAt: t.string,
        executionId: t.string,
        codemodSetName: t.string,
    }),
    buildTypeCodec({
        kind: t.literal(TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_ENDED),
        happenedAt: t.string,
        sessionId: t.string,
        executionId: t.string,
        codemodSetName: t.string,
        fileCount: t.string,
    }),
    buildTypeCodec({
        kind: t.literal(TELEMETRY_MESSAGE_KINDS.JOBS_CREATED),
        sessionId: t.string,
        happenedAt: t.string,
        executionId: t.string,
        codemodSetName: t.string,
        codemodName: t.string,
        jobCount: t.string,
    }),
    buildTypeCodec({
        kind: t.literal(TELEMETRY_MESSAGE_KINDS.JOB_UPDATED),
        sessionId: t.string,
        happenedAt: t.string,
        codemodSetName: t.string,
        codemodName: t.string,
    }),
    buildTypeCodec({
        kind: t.union([
            t.literal(TELEMETRY_MESSAGE_KINDS.JOB_UPDATED),
            t.literal(TELEMETRY_MESSAGE_KINDS.JOBS_ACCEPTED),
            t.literal(TELEMETRY_MESSAGE_KINDS.JOBS_REJECTED),
        ]),
        sessionId: t.string,
        happenedAt: t.string,
        codemodSetName: t.string,
        codemodName: t.string,
        jobCount: t.string,
    }),
]);

export type TelemetryMessage = t.TypeOf<typeof telemetryMessageCodec>;