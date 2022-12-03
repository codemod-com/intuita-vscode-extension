import * as t from 'io-ts';
import { Uri } from 'vscode';
import { buildTypeCodec } from "../utilities";

const enum NoraRustEngineMessageKind {
	finish = 2,
	create = 4,
}

const messageCodec = t.union([
    buildTypeCodec({
        k: t.literal(NoraRustEngineMessageKind.create),
        p: t.string,
        o: t.string,
        c: t.string,
    }),
    buildTypeCodec({
        k: t.literal(NoraRustEngineMessageKind.finish),
    })
]);

export class NodaRustEngineService {
    #executableUri: Uri | null = null;

    

    async #bootstrap() {
		if (this.#executableUri) {
			return {
				executableUri: this.#executableUri,
			};
		}

        const executableUri = Uri.file("/intuita/nora-rust-engine/target/release/nora-rust-engine");

        this.#executableUri = executableUri;

		return {
			executableUri,
		};
	}
}

