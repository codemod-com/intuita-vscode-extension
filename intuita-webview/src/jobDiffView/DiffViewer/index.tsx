import { useRef, useState } from 'react';
import { JobDiffView } from './DiffItem';
import { DiffViewType } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';

import Header from './Header';
import { Diff } from './Diff';
import { useTheme } from '../../shared/Snippet/useTheme';
import type { PanelViewProps } from '../../../../src/components/webview/panelViewProps';
import { vscode } from '../../shared/utilities/vscode';

const changeJob = (direction: 'prev' | 'next') => {
	vscode.postMessage({
		kind: 'webview.panel.changeJob',
		direction,
	});
};

export const JobDiffViewContainer = (
	props: PanelViewProps & { kind: 'JOB' },
) => {
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
				totalJobsCount={props.jobCount}
				jobIndex={props.jobIndex}
				changeJob={changeJob}
			/>
			<div className="w-full pb-2-5 h-full" ref={containerRef}>
				<JobDiffView
					theme={theme}
					diff={diff}
					viewType={viewType}
					onDiffCalculated={setDiff}
					{...props}
				/>
			</div>
		</div>
	);
};
