import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';
import { codemodEntryCodec } from '../codemods/types';
import { executionErrorCodec } from '../errors/types';

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
			ids: t.readonlyArray(t.string),
			entities: t.record(t.string, entityCodec),
		}),
		emptyCollection,
	);
};

export const persistedStateCodecNew = buildTypeCodec({
	case: buildCollectionCodec(persistedCaseCodec),
	codemod: buildCollectionCodec(codemodEntryCodec),
	job: buildCollectionCodec(persistedJobCodec),
	lastCodemodHashDigests: withFallback(t.readonlyArray(t.string), []),
	executionErrors: withFallback(t.record(t.string, executionErrorCodec), {}),
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
		}),
		{
			focusedFileExplorerNodeId: null,
			openedFileExplorerNodeIds: [],
			visible: true,
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
	caseHashJobHashes: t.readonlyArray(t.string),
});