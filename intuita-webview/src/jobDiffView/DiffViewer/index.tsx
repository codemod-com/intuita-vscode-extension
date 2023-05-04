import { useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { DiffViewType } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';

import Header from './Header';
import { vscode } from '../../shared/utilities/vscode';

type JobDiffViewContainerProps = {
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
	title: string;
	diffId: string;
};

export const JobDiffViewContainer = ({
	title,
	jobs,
	diffId,
	postMessage,
}: JobDiffViewContainerProps) => {
	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');

	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});

	return (
		<div className="m-10 mt-0" id={`diffViewer-${diffId}`}>
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				title={title}
				jobs={jobs}
				diffId={diffId}
			/>
			{/* Reversing the array sorts the items in an alphabetical order of directories */}
			{jobs.reverse().map((el) => (
				<JobDiffView
					ViewType={viewType}
					key={el.jobHash}
					postMessage={postMessage}
					jobStaged={el.staged}
					onToggleJob={() => {
						const stagedJobs = new Set(
							jobs.filter((job) => job.staged),
						);

						if (stagedJobs.has(el)) {
							stagedJobs.delete(el);
						} else {
							stagedJobs.add(el);
						}

						vscode.postMessage({
							kind: 'webview.global.stageJobs',
							jobHashes: Array.from(stagedJobs).map(
								({ jobHash }) => jobHash,
							),
						});
					}}
					{...el}
				/>
			))}
		</div>
	);
};
