import { Container, Header } from './Container';
import { JobDiffViewProps } from '../App';
import { Collapsable } from '../Components/Collapsable';
import { JobHash } from '../../shared/types';
import { Diff, DiffComponent } from './Diff';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { reportIssue } from '../util';
import { forwardRef, memo, useCallback } from 'react';

type Props = JobDiffViewProps & {
	postMessage: (arg: JobAction) => void;
	viewType: 'inline' | 'side-by-side';
	jobStaged: boolean;
	onToggleJob(jobHash: JobHash): void;
	visible: boolean;
	toggleVisible: (jobHash: JobHash) => void;
	expanded: boolean;
	onToggle: (jobHash: JobHash, expanded: boolean) => void;
	height: number;
	diff: Diff | null;
	onHeightSet: (jobHash: JobHash, height: number) => void;
	onDiffCalculated: (jobHash: JobHash, diff: Diff) => void;
	theme: string;
};

export const JobDiffView = memo(
	forwardRef(
		(
			{
				viewType,
				jobHash,
				jobKind,
				oldFileContent,
				newFileContent,
				oldFileTitle,
				newFileTitle,
				title,
				jobStaged,
				onToggleJob,
				visible,
				toggleVisible,
				height,
				onHeightSet,
				onDiffCalculated,
				diff,
				expanded,
				onToggle,
				theme,
			}: Props,
			ref,
		) => {
			const report = useCallback(() => {
				reportIssue(
					jobHash,
					oldFileContent ?? '',
					newFileContent ?? '',
				);
			}, [jobHash, oldFileContent, newFileContent]);

			const handleToggleVisible = useCallback(() => {
				toggleVisible(jobHash);
			}, [jobHash, toggleVisible]);

			const handleToggle = useCallback(
				(expanded: boolean) => {
					onToggle(jobHash, expanded);
				},
				[jobHash, onToggle],
			);

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

			const handleToggleJob = useCallback(() => {
				onToggleJob(jobHash);
			}, [jobHash, onToggleJob]);

			return (
				<div
					ref={(r) => {
						if (typeof ref === 'function') {
							ref(r ?? undefined);
						}
					}}
					className="px-5 pb-2-5 "
				>
					<Collapsable
						defaultExpanded={expanded}
						onToggle={handleToggle}
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
								onViewedChange={handleToggleVisible}
								viewed={!visible}
								title={title ?? ''}
								viewType={viewType}
								jobStaged={jobStaged}
								onToggleJob={handleToggleJob}
								onReportIssue={report}
							/>
						}
					>
						<Container>
							<DiffComponent
								theme={theme}
								height={height}
								viewType={viewType}
								oldFileContent={oldFileContent}
								newFileContent={newFileContent}
								onDiffCalculated={handleDiffCalculated}
								onHeightSet={handleSetHeight}
							/>
						</Container>
					</Collapsable>
				</div>
			);
		},
	),
);
