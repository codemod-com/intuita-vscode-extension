import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { DiffViewType } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';

import Header from './Header';
import { Diff } from './Diff';
import { useTheme } from '../../shared/Snippet/useTheme';

type JobDiffViewContainerProps = Readonly<{
	postMessage: (arg: JobAction) => void;
	job: JobDiffViewProps;
	showHooksCTA: boolean;
	totalJobsCount: number;
	jobIndex: number;
	setJobIndex: Dispatch<SetStateAction<number>>;
}>;

type DiffItem = Readonly<{
	visible: boolean;
	diff: Diff | null;
	expanded: boolean;
}>;

const jobDiffViewDefaultState = {
	visible: true,
	diff: null,
	expanded: true,
};

export const JobDiffViewContainer = ({
	job,
	postMessage,
	showHooksCTA,
	totalJobsCount,
	jobIndex,
	setJobIndex,
}: JobDiffViewContainerProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [diffData, setDiffData] = useState<DiffItem>(jobDiffViewDefaultState);

	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});

	const theme = useTheme();

	const toggleVisible = useCallback(() => {
		setDiffData((diffItem) => {
			return {
				...diffItem,
				visible: !diffItem?.visible,
				expanded: !diffItem?.visible,
			};
		});
	}, [setDiffData]);

	const onDiffCalculated = useCallback(
		(diff: Diff) => {
			setDiffData((diffItem) => {
				return {
					...diffItem,
					diff,
				};
			});
		},
		[setDiffData],
	);

	const { expanded, diff, visible } = diffData;

	return (
		<div className="w-full h-full flex flex-col">
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				jobs={[job]}
				showHooksCTA={showHooksCTA}
				totalJobsCount={totalJobsCount}
				jobIndex={jobIndex}
				setJobIndex={setJobIndex}
			/>
			<div className="w-full pb-2-5 h-full" ref={containerRef}>
				<JobDiffView
					theme={theme}
					expanded={expanded}
					diff={diff}
					visible={visible}
					viewType={viewType}
					toggleVisible={toggleVisible}
					postMessage={postMessage}
					onDiffCalculated={onDiffCalculated}
					{...job}
				/>
			</div>
		</div>
	);
};
