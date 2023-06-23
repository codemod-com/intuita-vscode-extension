import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';
import { codemodEntryCodec } from '../codemods/types';
import { executionErrorCodec } from '../errors/types';
import { withFallback } from 'io-ts-types';
import { jobHashCodec, persistedJobCodec } from '../jobs/types';
import { caseCodec, caseHashCodec } from '../cases/types';
import { explorerNodeHashDigestCodec } from '../selectors/selectExplorerTree';
import { codemodNodeHashDigestCodec } from '../selectors/selectCodemodTree';

export const syntheticErrorCodec = buildTypeCodec({
	kind: t.literal('syntheticError'),
	message: t.string,
});

export const workspaceStateCodec = t.union([
	buildTypeCodec({
		_tag: t.literal('Left'),
		left: syntheticErrorCodec,
	}),
	buildTypeCodec({
		_tag: t.literal('Right'),
		right: t.string,
	}),
	buildTypeCodec({
		_tag: t.literal('Both'),
		left: syntheticErrorCodec,
		right: t.string,
	}),
]);

export enum TabKind {
	codemods = 'codemods',
	codemodRuns = 'codemodRuns',
	community = 'community',
}

const emptyCollection = { ids: [], entities: {} };
const buildCollectionCodec = <T extends t.Props>(
	entityCodec: t.ReadonlyC<t.ExactC<t.TypeC<T>>>,
) => {
	return withFallback(
		buildTypeCodec({
			ids: t.readonlyArray(t.union([t.string, t.number])),
			entities: t.record(t.string, t.union([entityCodec, t.undefined])),
		}),
		emptyCollection,
	);
};

export const persistedStateCodecNew = buildTypeCodec({
	case: buildCollectionCodec(caseCodec),
	codemod: buildCollectionCodec(codemodEntryCodec),
	job: buildCollectionCodec(persistedJobCodec),
	lastCodemodHashDigests: withFallback(t.readonlyArray(t.string), []),
	executionErrors: withFallback(
		t.record(t.string, t.readonlyArray(executionErrorCodec)),
		{},
	),
	codemodDiscoveryView: withFallback(
		buildTypeCodec({
			executionPaths: t.record(t.string, t.string),
			focusedCodemodHashDigest: t.union([
				codemodNodeHashDigestCodec,
				t.null,
			]),
			collapsedCodemodHashDigests: t.readonlyArray(
				codemodNodeHashDigestCodec,
			),
			searchPhrase: t.string,
		}),
		{
			executionPaths: {},
			focusedCodemodHashDigest: null,
			collapsedCodemodHashDigests: [],
			searchPhrase: '',
		},
	),
	changeExplorerView: withFallback(
		buildTypeCodec({
			collapsed: withFallback(t.boolean, false),
			focusedFileExplorerNodeId: t.union([
				explorerNodeHashDigestCodec,
				t.null,
			]),
			focusedJobHash: t.union([jobHashCodec, t.null]),
			collapsedNodeHashDigests: t.readonlyArray(
				explorerNodeHashDigestCodec,
			),
			searchPhrase: withFallback(t.string, ''),
		}),
		{
			focusedFileExplorerNodeId: null,
			focusedJobHash: null,
			collapsedNodeHashDigests: [],
			searchPhrase: '',
			collapsed: false,
		},
	),
	codemodRunsView: withFallback(
		buildTypeCodec({
			collapsed: withFallback(t.boolean, false),
			selectedCaseHash: t.union([caseHashCodec, t.null]),
		}),
		{
			collapsed: false,
			selectedCaseHash: null,
		},
	),
	caseHashJobHashes: withFallback(t.readonlyArray(t.string), []),
	appliedJobHashes: withFallback(t.readonlyArray(jobHashCodec), []),
	codemodExecutionInProgress: withFallback(t.boolean, false),
	activeTabId: withFallback(
		t.union([
			t.literal(TabKind.codemods),
			t.literal(TabKind.codemodRuns),
			t.literal(TabKind.community),
		]),
		TabKind.codemods,
	),
});

export type RootState = t.TypeOf<typeof persistedStateCodecNew>;
