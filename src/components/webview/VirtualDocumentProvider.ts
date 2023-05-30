import * as vscode from 'vscode';
import { basename, extname } from 'node:path';
import { MessageBus, MessageKind } from '../messageBus';
import { EngineService } from '../engineService';
import { CodemodHash } from './webviewEvents';
import axios from 'axios';

export class MetadataNotFoundError extends Error {}

const BASE_URL = `https://intuita-public.s3.us-west-1.amazonaws.com`;

export class TextDocumentContentProvider
	implements vscode.TextDocumentContentProvider
{
	private __codemodMetadata: Record<string, string> | null = null;
	public onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	public onDidChange = this.onDidChangeEmitter.event;

	constructor(
		private readonly __messageBus: MessageBus,
		private readonly __engineService: EngineService,
	) {
		this.__messageBus.subscribe(
			MessageKind.engineBootstrapped,
			async () => {
				const codemodList = await this.__engineService.getCodemodList();

				const hashes = codemodList.map((c) => c.hashDigest);

				this.__fetchCodemodsMetadata(hashes as CodemodHash[]);
			},
		);
	}

	public hasMetadata(uri: vscode.Uri): boolean {
		return this.__getCodemodMetadata(uri) !== null;
	}

	public provideTextDocumentContent(uri: vscode.Uri): string {
		return this.__getCodemodMetadata(uri) ?? '';
	}

	private async __fetchCodemodMetadata(
		hash: CodemodHash,
	): Promise<string | null> {
		try {
			const res = await axios.get<string>(
				`${BASE_URL}/codemod-registry/${hash}.md`,
			);
			return res.data;
		} catch (e) {
			return null;
		}
	}

	private async __fetchCodemodsMetadata(
		codemodHashes: CodemodHash[],
	): Promise<void> {
		const metadataWithHashesPromises = codemodHashes.map(async (hash) => {
			const metadata = await this.__fetchCodemodMetadata(hash);
			return { hash, metadata };
		});

		const metadataWithHashes = await Promise.all(
			metadataWithHashesPromises,
		);

		const codemodMetadata: Record<CodemodHash, string> = {};

		metadataWithHashes.forEach(({ hash, metadata }) => {
			if (metadata === null) {
				return;
			}

			codemodMetadata[hash] = metadata;
		});

		this.__codemodMetadata = codemodMetadata;
	}

	private __getCodemodMetadata(uri: vscode.Uri): string | null {
		if (this.__codemodMetadata === null) {
			return null;
		}

		const { path } = uri;
		const codemodHash = basename(path, extname(path));

		return this.__codemodMetadata[codemodHash] ?? null;
	}
}
