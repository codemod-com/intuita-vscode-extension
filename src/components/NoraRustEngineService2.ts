import { spawn } from "child_process";
import { Uri } from "vscode";
import * as readline from 'node:readline';
import { Job, JobHash } from "../jobs/types";
import { NoraRustEngineService } from "./noraRustEngineService";
import { EngineMessageKind, messageCodec } from "./engineService";
import prettyReporter from "io-ts-reporters";

export class NoraRustEngine2 {
    #noraRustEngineService: NoraRustEngineService;
    #executableUri: Uri | null = null;

    constructor(
        noraRustEngineService: NoraRustEngineService,
    ) {
        this.#noraRustEngineService = noraRustEngineService;
    }

    async compare(jobs: ReadonlyArray<Job>) {
        // const executableUri = await this.#noraRustEngineService.bootstrapExecutableUri();

        this.#executableUri = Uri.file('/intuita/nora-rust-engine/target/release/nora-rust-engine-linux')

        const childProcess = spawn(
			this.#executableUri.fsPath,
			[],
			{
				stdio: 'pipe',
			},
		);

        const interfase = readline.createInterface(childProcess.stdout);

        const jobHashes: JobHash[] = [];

        let i = 0;

        interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === EngineMessageKind.compare) {
                if (message.e) {
                    jobHashes.push(message.i as JobHash);
                }

                ++i;
            }

            if (i === jobs.length) {
                childProcess.kill();
            }
        });

        for (const job of jobs) {
            childProcess.stdin.write(
                JSON.stringify({
                    k: 5,
                    i: job.hash,
                    l: job.inputUri,
                    o: job.outputUri,
                }),
            );
        }
    }
}