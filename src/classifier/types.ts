import { IntuitaRange } from "../utilities";

export interface ClassifierDiagnostic {
    readonly code: string,
    readonly message: string,
    readonly range: IntuitaRange,
}