import Axios from 'axios';
import * as t from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import { exec } from 'node:child_process';
import { Mode } from 'node:fs';
import { promisify } from 'node:util';
import { FileSystem, Uri, workspace } from 'vscode';
import { buildCaseHash } from '../cases/buildCaseHash';
import {
	CaseKind,
	CaseWithJobHashes,
	RepairCodeByPolyglotPiranhaCaseSubKind,
} from '../cases/types';
import { buildRepairCodeJob } from '../features/repairCode/job';
import { buildFile } from '../files/buildFile';
import { File } from '../files/types';
import { Job } from '../jobs/types';
import { buildUriHash } from '../uris/buildUriHash';
import { UriHash } from '../uris/types';
import { buildIntuitaSimpleRange } from '../utilities';
import { FileSystemUtilities } from './fileSystemUtilities';
import { buildTypeCodec, ReplacementEnvelope } from './inferenceService';
import { MessageBus, MessageKind } from './messageBus';

class RequestError extends Error {}
class ForbiddenRequestError extends Error {}

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

const matchCodec = buildTypeCodec({
	name: t.literal('find_link_jsx_elements'),
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
});

type Match = t.TypeOf<typeof matchCodec>;

const rewriteCodec = buildTypeCodec({
	p_match: buildTypeCodec({
		range: rangeCodec,
		matches: buildTypeCodec({
			s: t.string,
			i: t.union([t.string, t.undefined]),
		}),
	}),
	replacement_string: t.string,
	matched_rule: t.union([
		t.literal('find_and_replace_from_next_image'),
		t.literal('find_and_replace_await_import_next_image'),
		t.literal('find_and_replace_from_next_future_image'),
		t.literal('find_and_replace_await_import_next_future_image'),
		t.literal('find_and_replace_require_next_image'),
		t.literal('find_and_replace_require_next_future_image'),
	]),
});

type Rewrite = t.TypeOf<typeof rewriteCodec>;

const piranhaOutputSummariesCodec = t.readonlyArray(
	buildTypeCodec({
		path: t.string,
		matches: t.readonlyArray(matchCodec),
		rewrites: t.readonlyArray(rewriteCodec),
	}),
);

export class PolyglotPiranhaRepairCodeService {
	#fileSystem: FileSystem;
	#fileSystemUtilities: FileSystemUtilities;
	#globalStorageUri: Uri;
	#messageBus: MessageBus;
	public constructor(
		fileSystem: FileSystem,
		fileSystemUtilities: FileSystemUtilities,
		globalStorageUri: Uri,
		messageBus: MessageBus,
	) {
		this.#fileSystem = fileSystem;
		this.#fileSystemUtilities = fileSystemUtilities;
		this.#globalStorageUri = globalStorageUri;
		this.#messageBus = messageBus;
	}

	public async buildRepairCodeJobs(storageUri: Uri) {
		const { executableUri, configurationUri } = await this.#bootstrap();

		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		await this.#fileSystem.createDirectory(storageUri);

		const uriHash = buildUriHash(uri.fsPath);

		const outputUri = Uri.joinPath(storageUri, uriHash);

		await executePolyglotPiranha(
			executableUri,
			configurationUri,
			uri,
			outputUri,
		);

		const content = await this.#fileSystem.readFile(outputUri);

		const { nextJsImageJobs, nextJsLinkJobs, uriHashFileMap } =
			await this.#buildJobs(content);

		await this.#fileSystem.delete(outputUri);

		const casesWithJobHashes: CaseWithJobHashes[] = [];

		if (nextJsImageJobs[0]) {
			const kind = CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA;
			const subKind =
				RepairCodeByPolyglotPiranhaCaseSubKind.NEXT_JS_IMAGE;

			const kase = {
				kind,
				subKind,
			} as const;

			const caseWithJobHashes: CaseWithJobHashes = {
				hash: buildCaseHash(kase, nextJsImageJobs[0].hash),
				kind,
				subKind,
				jobHashes: new Set(nextJsImageJobs.map((job) => job.hash)),
			};

			casesWithJobHashes.push(caseWithJobHashes);
		}

		if (nextJsLinkJobs[0]) {
			const kind = CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA;
			const subKind = RepairCodeByPolyglotPiranhaCaseSubKind.NEXT_JS_LINK;

			const kase = {
				kind,
				subKind,
			} as const;

			const caseWithJobHashes: CaseWithJobHashes = {
				hash: buildCaseHash(kase, nextJsLinkJobs[0].hash),
				kind,
				subKind,
				jobHashes: new Set(nextJsLinkJobs.map((job) => job.hash)),
			};

			casesWithJobHashes.push(caseWithJobHashes);
		}

		const jobs = nextJsImageJobs.concat(nextJsLinkJobs);

		this.#messageBus.publish({
			kind: MessageKind.upsertCases,
			uriHashFileMap,
			casesWithJobHashes,
			jobs,
			inactiveJobHashes: new Set(),
			inactiveDiagnosticHashes: new Set(),
			trigger: 'onCommand',
		});
	}

	async #buildJobs(content: Uint8Array) {
		const uriHashFileMap = new Map<UriHash, File>();
		const nextJsLinkJobs: Job[] = [];
		const nextJsImageJobs: Job[] = [];

		const buffer = Buffer.from(content);
		const input = JSON.parse(buffer.toString('utf8'));

		const either = piranhaOutputSummariesCodec.decode(input);

		if (either._tag === 'Left') {
			const report = prettyReporter.report(either);

			console.error(report);

			return {
				uriHashFileMap,
				nextJsLinkJobs,
				nextJsImageJobs,
			};
		}

		for (const { path, matches, rewrites } of either.right) {
			const uri = Uri.parse(path);

			const document = await workspace.openTextDocument(uri);
			const file = buildFile(uri, document.getText(), document.version);

			uriHashFileMap.set(buildUriHash(uri), file);

			matches
				.map((match) => this.#buildJob(file, match))
				.forEach((job) => {
					nextJsLinkJobs.push(job);
				});

			rewrites
				.map((rewrite) => this.#buildRewriteJob(file, rewrite))
				.forEach((job) => {
					nextJsImageJobs.push(job);
				});
		}

		return {
			uriHashFileMap,
			nextJsLinkJobs,
			nextJsImageJobs,
		};
	}

	#buildRewriteJob(file: File, rewrite: Rewrite): Job {
		const range = buildIntuitaSimpleRange(file.separator, file.lengths, [
			rewrite.p_match.range.start_point.row,
			rewrite.p_match.range.start_point.column,
			rewrite.p_match.range.end_point.row,
			rewrite.p_match.range.end_point.column,
		]);

		const replacementEnvelope: ReplacementEnvelope = {
			range,
			replacement: rewrite.replacement_string,
		};

		return buildRepairCodeJob(file, null, replacementEnvelope);
	}

	#buildJob(file: File, match: Match): Job {
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

	async #bootstrap() {
		await this.#fileSystem.createDirectory(this.#globalStorageUri);

		const executableBaseName = `polyglot-piranha-${encodeURIComponent(
			process.arch,
		)}-${encodeURIComponent(process.platform)}`;

		const executableUri = Uri.joinPath(
			this.#globalStorageUri,
			executableBaseName,
		);

		try {
			await this.#downloadFileIfNeeded(
				`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha/${executableBaseName}`,
				executableUri,
				'755',
			);
		} catch (error) {
			if (!(error instanceof ForbiddenRequestError)) {
				throw error;
			}

			throw new Error(
				`Your architecture (${process.arch}) and your platform (${process.platform}) are not supported.`,
			);
		}

		const configurationUri = Uri.joinPath(
			this.#globalStorageUri,
			'polyglot-piranha-nextjs-configuration',
		);

		await this.#fileSystem.createDirectory(configurationUri);

		await this.#downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/piranha_arguments.toml`,
			Uri.joinPath(configurationUri, 'piranha_arguments.toml'),
			'644',
		);

		await this.#downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/rules.toml`,
			Uri.joinPath(configurationUri, 'rules.toml'),
			'644',
		);

		await this.#downloadFileIfNeeded(
			`https://intuita-public.s3.us-west-1.amazonaws.com/polyglot-piranha-nextjs-configuration/edges.toml`,
			Uri.joinPath(configurationUri, 'edges.toml'),
			'644',
		);

		return {
			executableUri,
			configurationUri,
		};
	}

	async #downloadFileIfNeeded(
		url: string,
		uri: Uri,
		chmod: Mode,
	): Promise<void> {
		const response = await Axios.head(url).catch((error) => {
			if (!Axios.isAxiosError(error)) {
				throw error;
			}

			const status = error.response?.status;

			if (status === 403) {
				throw new ForbiddenRequestError(
					`Could not make a request to ${url}: request forbidden`,
				);
			}

			throw new RequestError(`Could not make a request to ${url}`);
		});

		const lastModified = response.headers['last-modified'];
		const remoteModificationTime = lastModified
			? Date.parse(lastModified)
			: Date.now();

		const localModificationTime =
			await this.#fileSystemUtilities.getModificationTime(uri);

		if (localModificationTime < remoteModificationTime) {
			await this.#downloadFile(url, uri, chmod);
		}
	}

	async #downloadFile(url: string, uri: Uri, chmod: Mode): Promise<void> {
		const response = await Axios.get(url, { responseType: 'arraybuffer' });
		const content = new Uint8Array(response.data);

		await this.#fileSystem.writeFile(uri, content);

		await this.#fileSystemUtilities.setChmod(uri, chmod);
	}
}
