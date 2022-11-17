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
import {
	buildIntuitaSimpleRange,
	isNeitherNullNorUndefined,
} from '../utilities';
import { FileSystemUtilities } from './fileSystemUtilities';
import { buildTypeCodec, ReplacementEnvelope } from './inferenceService';
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

const rangeCodec = buildTypeCodec({
	start_point: buildTypeCodec({
		row: t.number,
		column: t.number,
	}),
	end_point: buildTypeCodec({
		row: t.number,
		column: t.number,
	}),
});

const matchCodec = t.union([
	buildTypeCodec({
		name: t.literal('find_nextjs_links'),
		match_: buildTypeCodec({
			range: rangeCodec,
			matches: buildTypeCodec({
				a_attribute_je: t.string,
				a_attributes: t.string,
				a_attribute_pi: t.string,
				a_children: t.string,
				link: t.string,
				a_name: t.string,
				link_name: t.string,
				link_attributes: t.string,
			}),
		}),
	}),
	buildTypeCodec({
		name: t.literal('find_nextjs_link_import_single_quotes'),
		match_: buildTypeCodec({
			range: rangeCodec,
			matches: buildTypeCodec({
				s: t.string,
			}),
		}),
	}),
]);

type Match = t.TypeOf<typeof matchCodec>;

const piranhaOutputSummariesCodec = t.readonlyArray(
	buildTypeCodec({
		path: t.string,
		matches: t.readonlyArray(matchCodec),
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

		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		await this._fileSystem.createDirectory(storageUri);

		const uriHash = buildUriHash(uri.fsPath);

		const outputUri = Uri.joinPath(storageUri, uriHash);

		await executePolyglotPiranha(
			executableUri,
			configurationUri,
			uri,
			outputUri,
		);

		const content = await this._fileSystem.readFile(outputUri);

		const { jobs, uriHashFileMap } = await this._buildJobs(content);

		await this._fileSystem.delete(outputUri);

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

	protected async _buildJobs(content: Uint8Array) {
		const uriHashFileMap = new Map<UriHash, File>();
		const jobs: Job[] = [];

		const buffer = Buffer.from(content);
		const input = JSON.parse(buffer.toString('utf8'));

		const either = piranhaOutputSummariesCodec.decode(input);

		if (either._tag === 'Left') {
			console.error(either.left);

			return {
				uriHashFileMap,
				jobs,
			};
		}

		for (const { path, matches } of either.right) {
			const uri = Uri.parse(path);

			const document = await workspace.openTextDocument(uri);
			const file = buildFile(uri, document.getText(), document.version);

			uriHashFileMap.set(buildUriHash(uri), file);

			const _jobs = matches
				.map((match) => this._buildJob(file, match))
				.filter(isNeitherNullNorUndefined);

			jobs.push(..._jobs);
		}

		return {
			uriHashFileMap,
			jobs,
		};
	}

	protected _buildJob(file: File, match: Match): Job | null {
		if (match.name !== 'find_nextjs_links') {
			return null;
		}

		const range = buildIntuitaSimpleRange(file.separator, file.lengths, [
			match.match_.range.start_point.row,
			match.match_.range.start_point.column,
			match.match_.range.end_point.row,
			match.match_.range.end_point.column,
		]);

		const { link_attributes, a_attributes, a_children } =
			match.match_.matches;

		const replacementEnvelope: ReplacementEnvelope = {
			range,
			replacement: `<Link ${link_attributes} ${a_attributes}>${a_children}</Link>`,
		};

		return buildRepairCodeJob(file, null, replacementEnvelope);
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
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/edges.toml`,
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
