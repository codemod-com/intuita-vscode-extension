import { randomBytes } from "node:crypto";

export const buildSessionId = (): string => {
    const buffer = randomBytes(8);

    const bigUint = buffer.readBigUint64BE();

    return String(bigUint);
}

export const buildExecutionId = (): string => {
    const buffer = randomBytes(2);
    const uint = buffer.readUint16BE();

    return String(uint);
}