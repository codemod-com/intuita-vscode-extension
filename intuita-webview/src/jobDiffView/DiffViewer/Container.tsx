import React, { forwardRef } from 'react';
import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import './Container.css';
import { JobDiffViewProps } from '../../shared/types';
import { JobKind } from '../../shared/constants';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { Diff } from './Diff';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';

type ContainerProps = Readonly<{
	children?: React.ReactNode;
}>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	({ children }: ContainerProps, ref) => {
		return (
			<div
				className="flex  flex-wrap w-full container flex-col"
				ref={ref}
			>
				<div className="flex flex-wrap flex-col w-full">{children}</div>
			</div>
		);
	},
);

type HeaderProps = Readonly<{
	id: string;
	diff: Diff | null;
	title: string;
	newFileTitle: string;
	oldFileTitle: string;
	jobKind: JobDiffViewProps['jobKind'];
	viewType: 'inline' | 'side-by-side';
	viewed?: boolean;
	children?: React.ReactNode;
	jobStaged: boolean;
	onViewedChange: () => void;
	onReportIssue(): void;
	onToggleJob(): void;
}>;

export const Header = ({
	id,
	diff,
	title,
	jobKind,
	oldFileTitle,
	children,
	viewed,
	jobStaged,
	onToggleJob,
	onViewedChange,
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

	return (
		<div id={id} className="flex w-full items-center container-header">
			<div className="flex flex-row flex-1 justify-between flex-wrap">
				<Popover
					trigger={
						<VSCodeCheckbox
							checked={jobStaged}
							onClick={onToggleJob}
						/>
					}
					popoverText="Select / Unselect to include or exclude the change."
				/>
				<div className="flex items-center flex-1">
					{jobKindText ? (
						<h4 className="my-0 ml-2 job-kind-text align-self-center">
							{jobKindText}
						</h4>
					) : null}
					<Popover
						disabled={
							(jobKind as unknown as JobKind) !== JobKind.copyFile
						}
						trigger={
							<h4 className="my-0 ml-1 diff-title align-self-center">
								{title}
							</h4>
						}
						popoverText={`Copied from ${oldFileTitle}`}
						offsetY={0}
					/>
					<VSCodeButton
						onClick={handleCopyFileName}
						appearance="icon"
						className="vscode-button"
					>
						<CopyIcon className="copy-icon" />
					</VSCodeButton>
				</div>

				<div
					className="flex gap-4"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Popover
						trigger={
							<VSCodeButton
								appearance="secondary"
								onClick={onReportIssue}
							>
								Report Issue
							</VSCodeButton>
						}
						popoverText="Open a Github issue with a provided template to report a problem."
					/>
					{hasDiff ? (
						<div className="ml-10 flex items-center justify-end diff-changes-container">
							<span className="diff-changes diff-removed">
								-{diff.removed}
							</span>

							<span> / </span>

							<span className="diff-changes diff-added">
								+{diff.added}
							</span>
						</div>
					) : null}
					<div
						className="viewed-button flex ml-10 justify-between checkbox-container items-center"
						onClick={(e) => {
							e.stopPropagation();
							onViewedChange();
						}}
					>
						<VSCodeCheckbox checked={viewed} />
						<p className="my-0 ml-10">Viewed</p>
					</div>
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
