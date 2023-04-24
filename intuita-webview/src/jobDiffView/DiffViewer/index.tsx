import { FormEvent, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import {
	VSCodeRadio,
	VSCodeRadioGroup,
} from '@vscode/webview-ui-toolkit/react';
import { DiffViewType } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';
import { ReactComponent as UnifiedIcon } from '../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../assets/Split.svg';

type JobDiffViewContainerProps = {
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
};

export const JobDiffViewContainer = ({
	jobs,
	postMessage,
}: JobDiffViewContainerProps) => {
	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [showViewTypeConfig, setShowViewTypeConfig] = useState(false);
	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});

	const onViewChange = (e: Event | FormEvent<HTMLElement>) => {
		const value = (e.target as HTMLSelectElement).value as DiffViewType;
		setViewType(value);
	};

	const handleMouseEnter = () => {
		setShowViewTypeConfig(true);
	};

	const handleMouseLeave = () => {
		setShowViewTypeConfig(false);
	};

	return (
		<div className="m-10">
			<div className="flex  justify-end">
				<VSCodeRadioGroup
					value={viewType}
					onChange={onViewChange}
					style={{ zIndex: 10001 }}
				>
					<div
						className="flex gap-4"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						{(showViewTypeConfig ||
							viewType === 'side-by-side') && (
							<div className="p-10 flex icon-container flex-col justify-start items-start">
								<SplitIcon className="icon" />
								<VSCodeRadio
									value="side-by-side"
									checked={viewType === 'side-by-side'}
									onChange={onViewChange}
								>
									Split
								</VSCodeRadio>
							</div>
						)}

						{(showViewTypeConfig || viewType === 'inline') && (
							<div className="p-10 icon-container flex flex-col justify-start items-start">
								<UnifiedIcon className="icon" />
								<VSCodeRadio
									value="inline"
									checked={viewType === 'inline'}
									onChange={onViewChange}
								>
									Unified
								</VSCodeRadio>
							</div>
						)}
					</div>
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
