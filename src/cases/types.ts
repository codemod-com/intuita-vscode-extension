import type { Node } from 'typescript';
import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

/**
 * [{
	"resource": "/gppd/intuita/egghead-next/src/components/layouts/collection-page-layout.tsx",
	"owner": "typescript0",
	"code": "2741",
	"severity": 8,
	"message": "Property 'alt' is missing in type '{ src: string; width: number; height: number; }' but required in type '{ src: string | StaticImport; alt: string; width?: SafeNumber | undefined; height?: SafeNumber | undefined; fill?: boolean | undefined; loader?: ImageLoader | undefined; ... 6 more ...; onLoadingComplete?: OnLoadingComplete | undefined; }'.",
	"source": "ts",
	"startLineNumber": 962,
	"startColumn": 34,
	"endLineNumber": 962,
	"endColumn": 39,
	"relatedInformation": [
		{
			"startLineNumber": 24,
			"startColumn": 5,
			"endLineNumber": 24,
			"endColumn": 8,
			"message": "'alt' is declared here.",
			"resource": "/gppd/intuita/egghead-next/node_modules/next/dist/client/image.d.ts"
		}
	]
}]
 */

export enum CaseKind {
	OTHER = 1,
	TS2769_OBJECT_ASSIGN = 2,
	MOVE_TOP_LEVEL_BLOCKS = 3,
	TS2322_NEXTJS_IMAGE_COMPONENT_EXCESSIVE_ATTRIBUTE = 4,
	TS2741_NEXTJS_IMAGE_COMPONENT_MISSING_ATTRIBUTE = 5,
}

export type Case = Readonly<{
	hash: CaseHash;
	kind: CaseKind;
	code: string | null;
	node: Node;
}>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlyArray<JobHash>;
	}>;
