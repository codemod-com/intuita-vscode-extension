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
		<div className="m-10 mt-0">
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				title={title}
				jobs={jobs}
				diffId={diffId}
			/>

			{jobs.map((el) => (
				<JobDiffView
					ViewType={viewType}
					key={el.jobHash}
					postMessage={postMessage}
					jobStaged={el.staged}
					onToggleJob={(staged: boolean) => {
						vscode.postMessage({
							kind: 'webview.global.stageJob',
							jobHash: el.jobHash,
							staged,
						});
					}}
					{...el}
				/>
			))}
		</div>
	);
};
