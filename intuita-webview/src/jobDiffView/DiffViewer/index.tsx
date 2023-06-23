import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobDiffView } from './DiffItem';
import { DiffViewType } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';

import Header from './Header';
import { Diff } from './Diff';
import { useTheme } from '../../shared/Snippet/useTheme';

type JobDiffViewContainerProps = Readonly<{
	job: JobDiffViewProps;
	totalJobsCount: number;
	jobIndex: number;
	setJobIndex: Dispatch<SetStateAction<number>>;
}>;

export const JobDiffViewContainer = ({
	job,
	totalJobsCount,
	jobIndex,
	setJobIndex,
}: JobDiffViewContainerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [diff, setDiff] = useState<Diff | null>(null);

	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});

	const theme = useTheme();

	return (
		<div className="w-full h-full flex flex-col">
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				jobs={[job]}
				totalJobsCount={totalJobsCount}
				jobIndex={jobIndex}
				setJobIndex={setJobIndex}
			/>
			<div className="w-full pb-2-5 h-full" ref={containerRef}>
				<JobDiffView
					theme={theme}
					diff={diff}
					viewType={viewType}
					onDiffCalculated={setDiff}
					{...job}
				/>
			</div>
		</div>
	);
};
