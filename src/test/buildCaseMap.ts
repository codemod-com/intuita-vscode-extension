import {readFileSync} from "fs";
import {join} from "path";

const regex = /^\/\*\*\s(\w+)-(\d{3})\s\*\*\/$/gm;

type Case = Readonly<{
    [k in string]?: string
}>;

export const buildCaseMap = (
    directoryPath: string,
): ReadonlyMap<number, Case> => {
    const cases = readFileSync(join(directoryPath, 'cases.ts'), 'utf8');

    const lines = cases.split('\n');

    const caseMap = new Map<number, Case>();

    let currentCaseNumber: number | null = null;
    let currentMode: string | null = null;
    let currentLines: string[] = [];

    lines.forEach(
        (line) => {
            const regExpExecArray = regex.exec(line);

            if (regExpExecArray === null) {
                if (currentCaseNumber === null) {
                    throw new Error('You need to have a case (number) if the header is not present.');
                }

                currentLines.push(line);

                return;
            }

            const mode = regExpExecArray[1];
            const caseString = regExpExecArray[2];

            if (!mode) {
                throw new Error('The mode needs to be specified in the header string');
            }

            if (!caseString) {
                throw new Error('The case number needs to be defined.');
            }

            const caseNumber = parseInt(caseString, 10);

            if (Number.isNaN(caseNumber)) {
                throw new Error('The case number needs to be an integer.');
            }

            if (currentCaseNumber === null) {
                currentCaseNumber = caseNumber;
            } else if (currentMode) {
                const _case = caseMap.get(currentCaseNumber) ?? {};

                caseMap.set(
                    currentCaseNumber,
                    {
                        ..._case,
                        [currentMode]: currentLines.join('\n'),
                    }
                );

                currentCaseNumber = caseNumber;
                currentLines = [];
            }

            currentMode = mode;
        }
    );

    if (currentCaseNumber && currentMode) {
        const _case = caseMap.get(currentCaseNumber) ?? {};

        caseMap.set(
            currentCaseNumber,
            {
                ..._case,
                [currentMode]: currentLines.join('\n'),
            }
        );
    }

    return caseMap;
};