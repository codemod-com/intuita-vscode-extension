import {readFileSync} from "fs";
import {join} from "path";

const regex = /^\/\*\*\s(old|new)-(\d{3})\s\*\*\//gm;

type Case = Readonly<{
    oldSourceFileText: string,
    newSourceFileText: string,
}>;

export const buildCaseMap = (
    directoryPath: string,
): ReadonlyMap<number, Case> => {
    const cases = readFileSync(join(directoryPath, 'cases.ts'), 'utf8');

    const lines = cases.split('\n');

    const oldCaseLineMap = new Map<number, string[]>();
    const newCaseLineMap = new Map<number, string[]>();
    const caseMap = new Map<number, Case>();

    let currentCase: number | null = null;
    let currentMode: 'old' | 'new' | null = null;

    lines.forEach(
        (line) => {
            const regExpExecArray = regex.exec(line);

            if (regExpExecArray === null) {
                if (currentCase === null) {
                    throw new Error('x');
                }

                if (currentMode === 'old') {
                    const caseLines = oldCaseLineMap.get(currentCase) ?? [];
                    caseLines.push(line);

                    oldCaseLineMap.set(currentCase, caseLines);
                } else if (currentMode === 'new') {
                    const caseLines = newCaseLineMap.get(currentCase) ?? [];
                    caseLines.push(line);

                    newCaseLineMap.set(currentCase, caseLines);
                }

                return;
            }

            const mode = regExpExecArray[1];
            const caseString = regExpExecArray[2];

            if (!mode) {
                throw new Error('The mode needs to be specified in the comment string');
            }

            if (!caseString) {
                throw new Error('The case number needs to be defined.');
            }

            const caseNumber = parseInt(caseString, 10);

            if (Number.isNaN(caseNumber)) {
                throw new Error('The case number needs to be an integer.');
            }

            if (mode === 'old') {
                currentMode = 'old';

                if (currentCase === null) {
                    currentCase = caseNumber;
                } else {
                    const caseLines = newCaseLineMap.get(currentCase) ?? [];

                    const _case = caseMap.get(currentCase) ?? {
                        oldSourceFileText: '',
                        newSourceFileText: '',
                    };

                    caseMap.set(
                        currentCase,
                        {
                            ..._case,
                            newSourceFileText: caseLines.join('\n'),
                        }
                    );

                    currentCase = caseNumber;
                }
            } else if (mode === 'new') {
                currentMode = 'new';

                if (currentCase === null) {
                    throw new Error('The current case needs to be defined.');
                } else {
                    const caseLines = oldCaseLineMap.get(currentCase) ?? [];

                    const _case = caseMap.get(currentCase) ?? {
                        oldSourceFileText: '',
                        newSourceFileText: '',
                    };

                    caseMap.set(
                        currentCase,
                        {
                            ..._case,
                            oldSourceFileText: caseLines.join('\n'),
                        }
                    );

                    currentCase = caseNumber;
                }
            }
        }
    );

    if (currentCase) {
        const caseLines = newCaseLineMap.get(currentCase) ?? [];

        const _case = caseMap.get(currentCase) ?? {
            oldSourceFileText: '',
            newSourceFileText: '',
        };

        caseMap.set(
            currentCase,
            {
                ..._case,
                newSourceFileText: caseLines.join('\n'),
            }
        );
    }

    return caseMap;
};