import * as vscode from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import axios from 'axios';
import { buildCodemodMetadataHash, buildTypeCodec } from '../../utilities';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';

export class MetadataNotFoundError extends Error {}

const indexItemCodec = buildTypeCodec({
	kind: t.literal('README'),
	name: t.string,
	path: t.string,
});

const BASE_URL = `https://intuita-public.s3.us-west-1.amazonaws.com`;

export class TextDocumentContentProvider
	implements vscode.TextDocumentContentProvider
{
	private __codemodMetadata = new Map<string, string>();
	public onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	public onDidChange = this.onDidChangeEmitter.event;

	constructor(private readonly __messageBus: MessageBus) {
		this.__messageBus.subscribe(
			MessageKind.engineBootstrapped,
			async () => {
				this.__fetchCodemodRegistryIndex();
			},
		);
	}

	public hasMetadata(uri: vscode.Uri): boolean {
		return this.__getCodemodMetadata(uri) !== null;
	}

	public provideTextDocumentContent(uri: vscode.Uri): string {
		return this.__getCodemodMetadata(uri) ?? '';
	}

	private async __fetchCodemodRegistryIndex() {
		try {
			const url = `${BASE_URL}/codemod-registry/index.json`;

			const response = await axios.get<string>(url);

			const validation = t
				.readonlyArray(indexItemCodec)
				.decode(response.data);

			if (E.isLeft(validation)) {
				throw new Error('Could not decode the response');
			}

			for (const indexItem of validation.right) {
				const metadata = await this.__fetchCodemodMetadata(
					indexItem.path,
				);

				if (metadata === null) {
					continue;
				}

				const hash = buildCodemodMetadataHash(indexItem.name);

				this.__codemodMetadata.set(hash, metadata);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async __fetchCodemodMetadata(path: string): Promise<string | null> {
		try {
			const url = `${BASE_URL}/codemod-registry/${path}`;

			const response = await axios.get<string>(url);

			return response.data;
		} catch (e) {
			return null;
		}
	}

	private __getCodemodMetadata(uri: vscode.Uri): string | null {
		const { path } = uri;

		const name = path.replace(/\.md$/, '');
		const hash = buildCodemodMetadataHash(name);

		return this.__codemodMetadata.get(hash) ?? null;
	}
}
