import { Header } from './Container';
import { Collapsable } from '../Components/Collapsable';
import { Diff, DiffComponent } from './Diff';
import { reportIssue } from '../util';
import { KeyboardEvent, forwardRef, memo, useCallback, useState } from 'react';
import './DiffItem.css';
import { vscode } from '../../shared/utilities/vscode';
import debounce from '../../shared/utilities/debounce';
import { PanelViewProps } from '../../../../src/components/webview/panelViewProps';

type Props = PanelViewProps & { kind: 'JOB' } & {
	viewType: 'inline' | 'side-by-side';
	theme: string;
};

export const JobDiffView = memo(
	forwardRef<HTMLDivElement, Props>(
		(
			{
				viewType,
				jobHash,
				jobKind,
				oldFileContent,
				newFileContent,
				oldFileTitle,
				reviewed,
				title,
				theme,
				modifiedByUser,
				caseHash,
			}: Props,
			ref,
		) => {
			const [diff, setDiff] = useState<Diff | null>(null);

			const report = useCallback(() => {
				reportIssue(
					jobHash,
					oldFileContent ?? '',
					newFileContent ?? '',
				);
			}, [jobHash, oldFileContent, newFileContent]);

			const handleDiffCalculated = (diff: Diff) => {
				setDiff(diff);
			};

			const handleContentChange = debounce((newContent: string) => {
				const changed = newContent !== newFileContent;
				if (changed) {
					vscode.postMessage({
						kind: 'webview.panel.contentModified',
						newContent,
						jobHash,
					});
				}
			}, 1000);

			return (
				<div
					ref={ref}
					className="px-5 pb-2-5 diff-view-container h-full"
					tabIndex={0}
					onKeyDown={(event: KeyboardEvent) => {
						if (event.key === 'ArrowLeft') {
							event.preventDefault();

							vscode.postMessage({
								kind: 'webview.panel.focusOnChangeExplorer',
							});
						}
					}}
				>
					<Collapsable
						defaultExpanded={true}
						className="overflow-hidden rounded h-full"
						headerClassName="p-10"
						contentClassName="p-10 h-full"
						headerSticky
						headerComponent={
							<Header
								diff={diff}
								modifiedByUser={modifiedByUser}
								oldFileTitle={oldFileTitle ?? ''}
								jobKind={jobKind}
								caseHash={caseHash}
								jobHash={jobHash}
								title={title ?? ''}
								reviewed={reviewed}
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
							jobHash={jobHash}
						/>
					</Collapsable>
				</div>
			);
		},
	),
);
