import {readFileSync} from "fs";
import {join} from "path";

describe.only('', () => {
    it('', () => {
        const cases = readFileSync(join(__dirname, 'cases.ts'), 'utf8');

        const lines = cases.split('\n');

        const regex = /^\/\*\*\s(old|new)-(\d{3})\s\*\*\//gm;

        const oldCaseLineMap = new Map<number, string[]>();
        // const oldCaseMap = new Map<number, string>();
        const newCaseLineMap = new Map<number, string[]>();
        // const newCaseMap = new Map<number, string>();
        const caseMap = new Map<number, Readonly<{ oldSourceFileText: string, newSourceFileText: string }>>();

        let currentCase: number | null = null;
        let currentMode: 'old' | 'new' = 'old';

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
                    } else {
                        const caseLines = newCaseLineMap.get(currentCase) ?? [];
                        caseLines.push(line);

                        newCaseLineMap.set(currentCase, caseLines);
                    }

                    return;
                }

                console.log(regExpExecArray);

                const commentType = regExpExecArray[1];
                const caseString = regExpExecArray[2];

                if (!commentType) {
                    throw new Error('x');
                }

                if (!caseString) {
                    throw new Error('x');
                }

                const caseNumber = parseInt(caseString, 10);

                if (Number.isNaN(caseNumber)) {
                    throw new Error('x');
                }

                if (commentType === 'old') {
                    currentMode = 'old'

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
                                newSourceFileText: caseLines.join(' \n'),
                            }
                        );

                        currentCase = caseNumber;
                    }
                }

                if (commentType === 'new') {
                    currentMode = 'new'

                    if (currentCase === null) {
                        throw new Error('');
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
                                oldSourceFileText: caseLines.join(' \n'),
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
                    newSourceFileText: caseLines.join(' \n'),
                }
            );
        }

        console.log(caseMap);
    });
})