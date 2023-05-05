import { Container, Header } from './Container';
import { JobDiffViewProps } from '../App';
import { Collapsable } from '../Components/Collapsable';
import { JobHash } from '../../shared/types';
import { Diff, DiffComponent } from './Diff';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { reportIssue } from '../util';

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
	onHeightSet: (height: number) => void;
	diff: Diff | null;
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

	return (
		<div
			ref={(ref) => containerRef?.(ref ?? undefined)}
			className="px-5 pb-2-5 "
		>
			<Collapsable
				id={newFileTitle ?? ''}
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
				<Container
					viewType={ViewType}
					oldFileName={oldFileTitle}
					newFileName={newFileTitle}
				>
					<DiffComponent
						theme={theme}
						height={height}
						onHeightSet={onHeightSet}
						onDiffCalculated={(diff) =>
							onDiffCalculated(jobHash, diff)
						}
						viewType={ViewType}
						oldFileContent={oldFileContent}
						newFileContent={newFileContent}
					/>
				</Container>
			</Collapsable>
		</div>
	);
};
