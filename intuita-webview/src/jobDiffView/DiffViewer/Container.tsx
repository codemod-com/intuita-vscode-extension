import React from 'react';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import './Container.css';
import { JobDiffViewProps } from '../../shared/types';
import { JobKind } from '../../shared/constants';
import { ReactComponent as CopyIcon } from '../../assets/copy.svg';
import { Diff } from './Diff';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';

type HeaderProps = Readonly<{
	id: string;
	diff: Diff | null;
	title: string;
	oldFileTitle: string;
	jobKind: JobDiffViewProps['jobKind'];
	children?: React.ReactNode;
	onReportIssue(): void;
}>;

export const Header = ({
	id,
	diff,
	title,
	oldFileTitle,
	jobKind,
	children,
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
		<div
			id={id}
			className="flex w-full align-items-center container-header"
		>
			<div className="flex flex-row flex-1 justify-between flex-wrap">
				<div className="flex align-items-center flex-1">
					{jobKindText ? (
						<h4 className="my-0 ml-2 job-kind-text align-self-center user-select-none">
							{jobKindText}
						</h4>
					) : null}
					<Popover
						disabled={
							(jobKind as unknown as JobKind) !== JobKind.copyFile
						}
						children={
							<h4 className="my-0 ml-1 diff-title align-self-center user-select-none">
								{title}
							</h4>
						}
						content={`Copied from ${oldFileTitle}`}
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
						children={
							<VSCodeButton
								appearance="secondary"
								onClick={onReportIssue}
							>
								Report Issue
							</VSCodeButton>
						}
						content="Open a Github issue with a provided template to report a problem."
					/>
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
