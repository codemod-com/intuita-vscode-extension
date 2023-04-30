import { useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { DiffViewType } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';

import Header from './Header';
import { JobHash } from '../../../../src/jobs/types';

type JobDiffViewContainerProps = {
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
	title: string;
	diffId: string;
	changesAccepted: boolean;
};

export const JobDiffViewContainer = ({
	title,
	jobs,
	diffId,
	changesAccepted,
	postMessage,
}: JobDiffViewContainerProps) => {
	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [stagedJobHashes, setStagedJobHashes] = useState(new Set<JobHash>());

	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});

	return (
		<div className="m-10 mt-0">
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				title={title}
				stagedJobHashes={stagedJobHashes}
				diffId={diffId}
				changesAccepted={changesAccepted}
			/>

			{jobs.map((el) => (
				<JobDiffView
					ViewType={viewType}
					key={el.jobHash}
					postMessage={postMessage}
					jobStaged={stagedJobHashes.has(el.jobHash)}
					onToggleJob={() => {
						setStagedJobHashes((prevStagedJobHashes) => {
							const nextStagedJobHashes = new Set(
								prevStagedJobHashes,
							);
							if (nextStagedJobHashes.has(el.jobHash)) {
								nextStagedJobHashes.delete(el.jobHash);
							} else {
								nextStagedJobHashes.add(el.jobHash);
							}

							return nextStagedJobHashes;
						});
					}}
					{...el}
				/>
			))}
		</div>
	);
};
