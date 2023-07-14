import React from 'react';
import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import './Container.css';
import { JobKind } from '../../shared/constants';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { Diff } from './Diff';
import IntuitaPopover from '../../shared/IntuitaPopover';
import { vscode } from '../../shared/utilities/vscode';
import { PanelViewProps } from '../../../../src/components/webview/panelViewProps';

type HeaderProps = Readonly<{
	diff: Diff | null;
	title: string;
	oldFileTitle: string;
	jobKind: (PanelViewProps & { kind: 'JOB' })['jobKind'];
	caseHash: (PanelViewProps & { kind: 'JOB' })['caseHash'];
	jobHash: (PanelViewProps & { kind: 'JOB' })['jobHash'];
	reviewed: (PanelViewProps & { kind: 'JOB' })['reviewed'];
	onReportIssue(): void;
	modifiedByUser: boolean;
	children?: React.ReactNode;
}>;

export const Header = ({
	diff,
	title,
	oldFileTitle,
	jobKind,
	caseHash,
	jobHash,
	modifiedByUser,
	children,
	reviewed,
	onReportIssue,
}: HeaderProps) => {
	const jobKindText = getJobKindText(jobKind as unknown as JobKind);
	const hasDiff = diff !== null;
	const handleCopyFileName = (event: React.FormEvent<HTMLElement>) => {
		event.stopPropagation();
		navigator.clipboard.writeText(title);
		vscode.postMessage({
			kind: 'webview.global.showInformationMessage',
			value: 'File name copied to clipboard',
		});
	};
	const handleReviewedClick = (event: React.MouseEvent) => {
		event.stopPropagation();

		vscode.postMessage({
			kind: 'webview.global.flipReviewedExplorerNode',
			caseHashDigest: caseHash,
			jobHash,
			path: title,
		});
	};

	return (
		<div className="flex w-full align-items-center container-header">
			<div className="flex flex-row flex-1 justify-between flex-wrap">
				<div className="flex align-items-center flex-1">
					{jobKindText ? (
						<h4 className="my-0 ml-2 highlighted-text align-self-center user-select-none">
							{jobKindText}
						</h4>
					) : null}
					<IntuitaPopover
						disabled={
							(jobKind as unknown as JobKind) !== JobKind.copyFile
						}
						content={`Copied from ${oldFileTitle}`}
					>
						<h4 className="my-0 ml-1 diff-title align-self-center user-select-none">
							{title}
						</h4>
					</IntuitaPopover>
					<VSCodeButton
						onClick={handleCopyFileName}
						appearance="icon"
						className="vscode-button"
					>
						<CopyIcon className="copy-icon" />
					</VSCodeButton>
					{modifiedByUser ? (
						<h4 className="my-0 ml-2 highlighted-text align-self-center user-select-none">
							(change saved)
						</h4>
					) : null}
				</div>

				<div
					className="flex gap-4"
					onClick={(e) => {
						e.stopPropagation();
					}}
					style={{ height: '28px' }}
				>
					<div
						className="flex align-items-center checkbox-container"
						onClick={handleReviewedClick}
					>
						<VSCodeCheckbox checked={reviewed} />
						<p
							className="user-select-none ml-10"
							style={{
								color: 'var(--button-secondary-foreground)',
							}}
						>
							Reviewed
						</p>
					</div>
					<IntuitaPopover
						content={
							<div
								style={{
									padding: '8px',
									backgroundColor:
										'var(--vscode-tab-inactiveBackground)',
								}}
							>
								Open a Github issue with a provided template to
								report a problem.
							</div>
						}
						placement="bottom"
					>
						<VSCodeButton
							appearance="secondary"
							onClick={onReportIssue}
						>
							Report Issue
						</VSCodeButton>
					</IntuitaPopover>
					{hasDiff ? (
						<div className="ml-10 flex align-items-center justify-end diff-changes-container">
							<span className="diff-changes diff-removed">
								-
								{[
									JobKind.createFile,
									JobKind.copyFile,
									JobKind.moveFile,
								].includes(jobKind as unknown as JobKind)
									? '0'
									: diff.removed}
							</span>

							<span> / </span>

							<span className="diff-changes diff-added">
								+{diff.added}
							</span>
						</div>
					) : null}
				</div>
			</div>
			{children}
		</div>
	);
};

const getJobKindText = (jobKind: JobKind): string => {
	switch (jobKind) {
		case JobKind.copyFile:
		case JobKind.createFile:
			return '(created)';
		case JobKind.deleteFile:
			return '(deleted)';
		case JobKind.moveAndRewriteFile:
			return '(moved & rewritten)';
		case JobKind.moveFile:
			return '(moved)';
		default:
			return '';
	}
};
