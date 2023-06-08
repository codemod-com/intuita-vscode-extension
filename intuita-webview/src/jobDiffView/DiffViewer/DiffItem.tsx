import { Header } from './Container';
import { JobDiffViewProps } from '../App';
import { Collapsable } from '../Components/Collapsable';
import { Diff, DiffComponent } from './Diff';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { reportIssue } from '../util';
import { KeyboardEvent, forwardRef, memo, useCallback } from 'react';
import './DiffItem.css';
import { vscode } from '../../shared/utilities/vscode';
import debounce from '../../shared/utilities/debounce';

type Props = JobDiffViewProps & {
	postMessage: (arg: JobAction) => void;
	viewType: 'inline' | 'side-by-side';
	visible: boolean;
	toggleVisible: () => void;
	expanded: boolean;
	diff: Diff | null;
	onDiffCalculated: (diff: Diff) => void;
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
				visible,
				toggleVisible,
				onDiffCalculated,
				diff,
				expanded,
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
				toggleVisible();
			}, [toggleVisible]);

			const handleDiffCalculated = useCallback(
				(diff: Diff) => {
					onDiffCalculated(diff);
				},
				[onDiffCalculated],
			);

			const handleContentChange = debounce((newContent: string) => {
				vscode.postMessage({
					kind: 'webview.jobDiffView.contentModified',
					newContent,
					jobHash,
				});
			}, 350);

			return (
				<div
					ref={(r) => {
						if (typeof ref === 'function') {
							ref(r ?? undefined);
						}
					}}
					className="px-5 pb-2-5 diff-view-container h-full"
					id="diffViewContainer"
					tabIndex={0}
					onKeyDown={(event: KeyboardEvent) => {
						if (event.key === 'ArrowLeft') {
							event.preventDefault();

							vscode.postMessage({
								kind: 'webview.global.focusView',
								webviewName: 'changeExplorer',
							});
						}
					}}
				>
					<Collapsable
						defaultExpanded={expanded}
						className="overflow-hidden rounded h-full"
						headerClassName="p-10"
						contentClassName="p-10 h-full"
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
								onReportIssue={report}
							/>
						}
					>
						<DiffComponent
							theme={theme}
							viewType={viewType}
							oldFileContent={oldFileContent}
							newFileContent={newFileContent}
							onDiffCalculated={handleDiffCalculated}
							onChange={handleContentChange}
						/>
					</Collapsable>
				</div>
			);
		},
	),
);
