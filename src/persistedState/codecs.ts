import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';
import { codemodEntryCodec } from '../codemods/types';
import { executionErrorCodec } from '../errors/types';
import { withFallback } from 'io-ts-types';
import { jobHashCodec, persistedJobCodec } from '../jobs/types';
import { caseCodec } from '../cases/types';

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
	communityView: withFallback(buildTypeCodec({ visible: t.boolean }), {
		visible: true,
	}),
	codemodDiscoveryView: withFallback(
		buildTypeCodec({
			visible: t.boolean,
			executionPaths: t.record(t.string, t.string),
			focusedCodemodHashDigest: t.union([t.string, t.null]),
			openedCodemodHashDigests: t.readonlyArray(t.string),
		}),
		{
			visible: true,
			executionPaths: {},
			focusedCodemodHashDigest: null,
			openedCodemodHashDigests: [],
		},
	),
	changeExplorerView: withFallback(
		buildTypeCodec({
			focusedFileExplorerNodeId: t.union([t.string, t.null]),
			openedFileExplorerNodeIds: t.readonlyArray(t.string),
			visible: t.boolean,
			searchPhrase: withFallback(t.string, ''),
		}),
		{
			focusedFileExplorerNodeId: null,
			openedFileExplorerNodeIds: [],
			visible: true,
			searchPhrase: '',
		},
	),
	codemodRunsView: withFallback(
		buildTypeCodec({
			selectedCaseHash: t.union([t.string, t.null]),
			visible: t.boolean,
		}),
		{
			selectedCaseHash: null,
			visible: true,
		},
	),
	caseHashJobHashes: withFallback(t.readonlyArray(t.string), []),
	appliedJobHashes: withFallback(t.readonlyArray(jobHashCodec), []),
	codemodExecutionInProgress: withFallback(t.boolean, false),
});

export type RootState = t.TypeOf<typeof persistedStateCodecNew>;
