import { Case, CaseKind } from "./types";

export const compareCases = <C extends Case>(
    caseA: C,
    caseB: C,
): number => {
    const caseAWeight = Number(caseA.kind === CaseKind.OTHER);
    const caseBWeight = Number(caseB.kind === CaseKind.OTHER);

    return caseAWeight - caseBWeight;
};

