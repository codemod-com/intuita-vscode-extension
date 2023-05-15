import { Container, Header } from './Container';
import { JobDiffViewProps } from '../App';
import { Collapsable } from '../Components/Collapsable';
import { JobHash } from '../../shared/types';
import { Diff, DiffComponent } from './Diff';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { reportIssue } from '../util';
import { useCallback } from 'react';

type Props = JobDiffViewProps & {
	postMessage: (arg: JobAction) => void;
	ViewType: 'inline' | 'side-by-side';
	jobStaged: boolean;
	onToggleJob(staged: boolean): void;
	visible: boolean;
	toggleVisible: (jobHash: JobHash) => void;
	expanded: boolean;
	onToggle: (expanded: boolean) => void;
	height: number;
	diff: Diff | null;
	onHeightSet: (jobHash: JobHash, height: number) => void;
	onDiffCalculated: (jobHash: JobHash, diff: Diff) => void;
	containerRef: ((element?: Element | undefined) => void) | undefined;
	theme: string;
};

export const JobDiffView = ({
	ViewType,
	actions,
	jobHash,
	jobKind,
	oldFileContent,
	newFileContent,
	oldFileTitle,
	newFileTitle,
	title,
	jobStaged,
	postMessage,
	onToggleJob,
	visible,
	toggleVisible,
	height,
	onHeightSet,
	onDiffCalculated,
	diff,
	expanded,
	onToggle,
	containerRef,
	theme,
}: Props) => {
	const onAction = (action: JobAction) => {
		postMessage(action);
	};

	const report = () => {
		reportIssue(jobHash, oldFileContent ?? '', newFileContent ?? '');
	};

	const handleDiffCalculated = useCallback(
		(diff: Diff) => {
			onDiffCalculated(jobHash, diff);
		},
		[jobHash, onDiffCalculated],
	);

	const handleSetHeight = useCallback(
		(height: number) => {
			onHeightSet(jobHash, height);
		},
		[jobHash, onHeightSet],
	);

	return (
		<div
			ref={(ref) => containerRef?.(ref ?? undefined)}
			className="px-5 pb-2-5 "
		>
			<Collapsable
				defaultExpanded={expanded}
				onToggle={onToggle}
				className="overflow-hidden rounded "
				headerClassName="p-10"
				contentClassName="p-10"
				headerSticky
				headerComponent={
					<Header
						id={`diffViewHeader-${jobHash}`}
						diff={diff}
						oldFileTitle={oldFileTitle ?? ''}
						newFileTitle={newFileTitle ?? ''}
						jobKind={jobKind}
						onViewedChange={() => toggleVisible(jobHash)}
						viewed={!visible}
						onAction={onAction}
						actions={actions}
						title={title ?? ''}
						viewType={ViewType}
						jobStaged={jobStaged}
						onToggleJob={onToggleJob}
						onReportIssue={report}
					/>
				}
			>
				<Container>
					<DiffComponent
						theme={theme}
						height={height}
						viewType={ViewType}
						oldFileContent={oldFileContent}
						newFileContent={newFileContent}
						onDiffCalculated={handleDiffCalculated}
						onHeightSet={handleSetHeight}
					/>
				</Container>
			</Collapsable>
		</div>
	);
};
