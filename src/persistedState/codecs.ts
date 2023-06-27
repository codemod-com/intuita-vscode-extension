import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';
import { codemodEntryCodec } from '../codemods/types';
import { executionErrorCodec } from '../errors/types';
import { withFallback } from 'io-ts-types';
import { persistedJobCodec } from '../jobs/types';
import { caseCodec, caseHashCodec } from '../cases/types';
import { codemodNodeHashDigestCodec } from '../selectors/selectCodemodTree';
import {
	_explorerNodeCodec,
	_explorerNodeHashDigestCodec,
} from './explorerNodeCodec';

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
		}),
		{
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
	codemodExecutionInProgress: withFallback(t.boolean, false),
	activeTabId: withFallback(
		t.union([
			t.literal('codemods'),
			t.literal('codemodRuns'),
			t.literal('community'),
		]),
		'codemods',
	),
	explorerSearchPhrases: withFallback(t.record(caseHashCodec, t.string), {}),
	explorerNodes: withFallback(
		t.record(caseHashCodec, t.readonlyArray(_explorerNodeCodec)),
		{},
	),
	selectedExplorerNodes: withFallback(
		t.record(caseHashCodec, t.readonlyArray(_explorerNodeHashDigestCodec)),
		{},
	),
	collapsedExplorerNodes: withFallback(
		t.record(caseHashCodec, t.readonlyArray(_explorerNodeHashDigestCodec)),
		{},
	),
	focusedExplorerNodes: withFallback(
		t.record(caseHashCodec, _explorerNodeHashDigestCodec),
		{},
	),
});

export type RootState = t.TypeOf<typeof persistedStateCodecNew>;
