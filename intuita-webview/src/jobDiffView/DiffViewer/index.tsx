import { FormEvent, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import {
	VSCodeRadio,
	VSCodeRadioGroup,
} from '@vscode/webview-ui-toolkit/react';
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
				<VSCodeRadioGroup
					value={viewType}
					onChange={onViewChange}
					style={{ zIndex: 10001 }}
				>
					<VSCodeRadio value="inline"> Inline </VSCodeRadio>
					<VSCodeRadio value="side-by-side">Side By Side</VSCodeRadio>
				</VSCodeRadioGroup>
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
