import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Uri } from "vscode";
import * as readline from 'node:readline';
import { EngineMessageKind, messageCodec } from "./engineService";
import prettyReporter from "io-ts-reporters";
import { Message, MessageBus, MessageKind } from "./messageBus";
import { buildHash } from "../utilities";
import { buildUriHash } from "../uris/buildUriHash";

class CompareProcessWrapper {
    #exited = false;
    readonly #process: ChildProcessWithoutNullStreams;

    constructor(
        executableUri: Uri,
        messageBus: MessageBus,
    ) {
        this.#process = spawn(
			executableUri.fsPath,
			[],
			{
				stdio: 'pipe',
			},
		);

        this.#process.on('error', (error) => {
            console.error(error);

            this.#exited = true;
        })

        this.#process.on('exit', () => {
            this.#exited = true;
        })

        const interfase = readline.createInterface(process.stdout);

        interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === EngineMessageKind.compare) {
                messageBus.publish({
                    kind: MessageKind.filesCompared,
                    hash: message.i,
                    equal: message.e,
                });
            }
        });
    }

    isExited(): boolean {
        return this.#exited;
    }

    write(leftUri: Uri, rightUri: Uri) {
        const hash = buildHash([
            buildUriHash(leftUri),
            buildUriHash(rightUri),
        ].join(''));

        this.#process.stdin.write(
            JSON.stringify({
                k: 5,
                i: hash,
                l: leftUri.fsPath,
                o: rightUri.fsPath,
            }),
        );
    }

    kill() {
        // TODO this needs to be executed once we close the extension
        this.#process.kill();
    }
}

export class NoraCompareServiceEngine {
    #messageBus: MessageBus;
    #compareProcessWrapper: CompareProcessWrapper | null = null;

    constructor(
        messageBus: MessageBus,
    ) {
        this.#messageBus = messageBus;

        this.#messageBus.subscribe((message) => {
            if (message.kind === MessageKind.compareFiles) {
                setImmediate(
                    () => {
                        this.onCompareFilesMessage(message);
                    }
                )
            }
        })
    }

    onCompareFilesMessage(message: Message & { kind: MessageKind.compareFiles }) {
        if (!this.#compareProcessWrapper || this.#compareProcessWrapper.isExited()) {
            const executableUri = Uri.file('/intuita/nora-rust-engine/target/release/nora-rust-engine-linux')

            this.#compareProcessWrapper = new CompareProcessWrapper(executableUri, this.#messageBus);
        }

        this.#compareProcessWrapper.write(
            message.leftUri,
            message.rightUri,
        );
    }
}