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
    let currentKey: string | null = null;
    let currentLines: string[] = [];

    lines.forEach(
        (line) => {
            if (line === '/* @ts-ignore */') {
                return;
            }

            const regExpExecArray = regex.exec(line);

            if (regExpExecArray === null) {
                if (currentCaseNumber === null) {
                    throw new Error('You need to have a case (number) if the header is not present.');
                }

                currentLines.push(line);

                return;
            }

            const key = regExpExecArray[1];
            const caseString = regExpExecArray[2];

            if (!key) {
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
            } else if (currentKey) {
                const currentCase = caseMap.get(currentCaseNumber) ?? {};

                caseMap.set(
                    currentCaseNumber,
                    {
                        ...currentCase,
                        [currentKey]: currentLines.join('\n'),
                    }
                );

                currentCaseNumber = caseNumber;
                currentLines = [];
            }

            currentKey = key;
        }
    );

    if (currentCaseNumber && currentKey) {
        const currentCase = caseMap.get(currentCaseNumber) ?? {};

        caseMap.set(
            currentCaseNumber,
            {
                ...currentCase,
                [currentKey]: currentLines.join('\n'),
            }
        );
    }

    return caseMap;
};