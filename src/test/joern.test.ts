import {spawn} from "child_process";

enum JoernCliState {
    INITIAL = 1,
    IMPORTING_CODE = 2,
}

xdescribe('joern', async function() {
    this.timeout(60000);

    it('joern', () => {
        let state: JoernCliState = JoernCliState.INITIAL;

        const spawnee = spawn('joern');

        spawnee.stdout.on('data', (data) => {
            switch (state) {
                case JoernCliState.INITIAL:
                {
                    spawnee.stdin.write(
                        `importCode.javascript(inputPath="/gppd/intuita/intuita-vscode-extension", projectName="test")\n`
                    );

                    state = JoernCliState.IMPORTING_CODE;
                    return;
                }
            }

            console.log(`stdout: ${data}`);
        });

        spawnee.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    });
});