import Axios from 'axios';
import * as t from 'io-ts';
import { exec } from 'node:child_process';
import { Mode } from 'node:fs';
import { promisify } from 'node:util';
import { FileSystem, Uri, workspace } from 'vscode';
import { buildCaseHash } from '../cases/buildCaseHash';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { buildRepairCodeJob } from '../features/repairCode/job';
import { buildFile } from '../files/buildFile';
import { File } from '../files/types';
import { Job } from '../jobs/types';
import { buildUriHash } from '../uris/buildUriHash';
import { UriHash } from '../uris/types';
import { buildIntuitaSimpleRange } from '../utilities';
import { FileSystemUtilities } from './fileSystemUtilities';
import { buildTypeCodec } from './inferenceService';
import { MessageBus, MessageKind } from './messageBus';

const promisifiedExec = promisify(exec);

export const executePolyglotPiranha = async (
	executableUri: Uri,
	configurationUri: Uri,
	inputUri: Uri,
	outputUri: Uri,
): Promise<void> => {
	await promisifiedExec(
		`"${executableUri.fsPath}" -f "${configurationUri.fsPath}" -c "${inputUri.fsPath}" -j "${outputUri.fsPath}" -d true`,
	);
};

const piranhaOutputSummariesCodec = t.readonlyArray(
	buildTypeCodec({
		rewrites: t.readonlyArray(
			buildTypeCodec({
				p_match: buildTypeCodec({
					range: buildTypeCodec({
						start_point: buildTypeCodec({
							row: t.number,
							column: t.number,
						}),
						end_point: buildTypeCodec({
							row: t.number,
							column: t.number,
						}),
					}),
				}),
				replacement_string: t.string,
				matched_rule: t.string,
			}),
		),
	}),
);

export class PolyglotPiranhaRepairCodeService {
	public constructor(
		protected _fileSystem: FileSystem,
		protected _fileSystemUtilities: FileSystemUtilities,
		protected _globalStorageUri: Uri,
		protected _messageBus: MessageBus,
	) {}

	public async buildRepairCodeJobs(storageUri: Uri) {
		const { executableUri, configurationUri } = await this._bootstrap();

		const tsUris = await workspace.findFiles('**/*.ts', null, 100);
		const tsxUris = await workspace.findFiles('**/*.tsx', null, 100);

		const uris = tsUris.concat(tsxUris);

		await this._fileSystem.createDirectory(storageUri);

		const uriHashFileMap = new Map<UriHash, File>();
		const jobs: Job[] = [];

		for (const uri of uris) {
			const document = await workspace.openTextDocument(uri);
			const file = buildFile(uri, document.getText(), document.version);

			const uriHash = buildUriHash(uri.fsPath);

			const outputUri = Uri.joinPath(storageUri, uriHash);

			await executePolyglotPiranha(
				executableUri,
				configurationUri,
				uri,
				outputUri,
			);

			const content = await this._fileSystem.readFile(outputUri);

			jobs.push(...this._buildJobs(file, content));

			uriHashFileMap.set(uriHash, file);

			await this._fileSystem.delete(outputUri);
		}

		const kind: CaseKind = CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA;

		const caseWithJobHashes: CaseWithJobHashes = {
			hash: buildCaseHash({ kind }, jobs[0]?.hash ?? null),
			kind,
			jobHashes: new Set(jobs.map((job) => job.hash)),
		};

		this._messageBus.publish({
			kind: MessageKind.upsertCases,
			uriHashFileMap,
			casesWithJobHashes: [caseWithJobHashes],
			jobs,
			inactiveJobHashes: new Set(),
			inactiveDiagnosticHashes: new Set(),
			trigger: 'onCommand',
		});
	}

	protected _buildJobs(file: File, content: Uint8Array): ReadonlyArray<Job> {
		const buffer = Buffer.from(content);

		const either = piranhaOutputSummariesCodec.decode(
			JSON.parse(buffer.toString('utf8')),
		);

		if (either._tag === 'Left') {
			console.error(either.left);

			return [];
		}

		return either.right
			.flatMap(({ rewrites }) => rewrites)
			.flatMap((rewrite) => {
				const range = buildIntuitaSimpleRange(
					file.separator,
					file.lengths,
					[
						rewrite.p_match.range.start_point.row,
						rewrite.p_match.range.start_point.column,
						rewrite.p_match.range.end_point.row,
						rewrite.p_match.range.end_point.column,
					],
				);

				return {
					range,
					replacement: rewrite.replacement_string,
				};
			})
			.map((replacementEnvelope) => {
				return buildRepairCodeJob(file, null, replacementEnvelope);
			});
	}

	protected async _bootstrap() {
		await this._fileSystem.createDirectory(this._globalStorageUri);

		const executableBaseName = `polyglot-piranha-${encodeURIComponent(
			process.arch,
		)}-${encodeURIComponent(process.platform)}`;

		const executableUri = Uri.joinPath(
			this._globalStorageUri,
			executableBaseName,
		);

		this._downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha/${executableBaseName}`,
			executableUri,
			'755',
		);

		const configurationUri = Uri.joinPath(
			this._globalStorageUri,
			'polyglot-piranha-nextjs-configuration',
		);

		await this._fileSystem.createDirectory(configurationUri);

		await this._downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/piranha_arguments.toml`,
			Uri.joinPath(configurationUri, 'piranha_arguments.toml'),
			'644',
		);

		await this._downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/rules.toml`,
			Uri.joinPath(configurationUri, 'rules.toml'),
			'644',
		);

		await this._downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/rules.toml`,
			Uri.joinPath(configurationUri, 'edges.toml'),
			'644',
		);

		return {
			executableUri,
			configurationUri,
		};
	}

	protected async _downloadFileIfNeeded(
		url: string,
		uri: Uri,
		chmod: Mode,
	): Promise<void> {
		const response = await Axios.head(url);

		const lastModified = response.headers['last-modified'];
		const remoteModificationTime = lastModified
			? Date.parse(lastModified)
			: Date.now();

		const localModificationTime =
			await this._fileSystemUtilities.getModificationTime(uri);

		if (localModificationTime < remoteModificationTime) {
			await this._downloadFile(url, uri, chmod);
		}
	}

	protected async _downloadFile(
		url: string,
		uri: Uri,
		chmod: Mode,
	): Promise<void> {
		const response = await Axios.get(url, { responseType: 'arraybuffer' });
		const content = new Uint8Array(response.data);

		await this._fileSystem.writeFile(uri, content);

		await this._fileSystemUtilities.setChmod(uri, chmod);
	}
}
