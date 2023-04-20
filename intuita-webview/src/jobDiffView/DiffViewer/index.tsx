import { FormEvent, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { VSCodeDropdown } from '@vscode/webview-ui-toolkit/react';
import { DiffViewType } from '../../shared/types';

type JobDiffViewContainerProps = {
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
};

export const JobDiffViewContainer = ({
	jobs,
	postMessage,
}: JobDiffViewContainerProps) => {
	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const onViewChange = (e: Event | FormEvent<HTMLElement>) => {
		const value = (e.target as HTMLSelectElement).value as DiffViewType;
		setViewType(value);
	};
	return (
		<div className="m-10">
			<div className="flex  justify-end">
				<VSCodeDropdown
					value={viewType}
					onChange={onViewChange}
					style={{ zIndex: 10001 }}
				>
					<option value="inline">Inline</option>
					<option value="side-by-side">Side by side</option>
				</VSCodeDropdown>
			</div>
			{jobs.map((el) => (
				<JobDiffView
					ViewType={viewType}
					key={el.jobHash}
					postMessage={postMessage}
					{...el}
				/>
			))}
		</div>
	);
};
