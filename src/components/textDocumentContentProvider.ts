import {
	Event,
	EventEmitter,
	ProviderResult,
	TextDocumentContentProvider,
	Uri,
} from 'vscode';

export class IntuitaTextDocumentContentProvider
	implements TextDocumentContentProvider
{
	URI = Uri.parse('intuita:jscodeshiftCodemod.ts');
	#onDidChangeEmitter = new EventEmitter<Uri>();
	#content = '';
	onDidChange: Event<Uri> | undefined = undefined;

	constructor() {
		this.onDidChange = this.#onDidChangeEmitter.event;
	}

	setContent(content: string) {
		this.#content = content;

		this.#onDidChangeEmitter.fire(this.URI);
	}

	provideTextDocumentContent(uri: Uri): ProviderResult<string> {
		if (uri.toString() !== this.URI.toString()) {
			throw new Error();
		}

		return this.#content;
	}
}
