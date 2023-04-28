import React, { forwardRef } from 'react';
import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import Popup from 'reactjs-popup';
import './Container.css';
import { JobAction, JobDiffViewProps } from '../../shared/types';
import { JobKind } from '../../shared/constants';
import { Diff } from './Diff';

type ContainerProps = Readonly<{
	id: string;
	oldFileName: string | null;
	newFileName: string | null;
	viewType: 'inline' | 'side-by-side';
	children?: React.ReactNode;
}>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	(
		{ id, oldFileName, newFileName, children, viewType }: ContainerProps,
		ref,
	) => {
		return (
			<div
				id={id}
				className="flex  flex-wrap w-full container flex-col"
				ref={ref}
			>
				{viewType === 'side-by-side' && newFileName && oldFileName && (
					<div className="flex flex-row w-full">
						<div className="w-half ml-50">
							<p>{oldFileName}</p>
						</div>
						<div className="w-half ml-30">
							<p>{newFileName}</p>
						</div>
					</div>
				)}

				<div className="flex flex-wrap flex-col w-full">{children}</div>
			</div>
		);
	},
);

type HeaderProps = Readonly<{
	diff: Diff | null;
	title: string;
	newFileTitle: string;
	oldFileTitle: string;
	jobKind: JobDiffViewProps['jobKind'];
	viewType: 'inline' | 'side-by-side';
	viewed?: boolean;
	children?: React.ReactNode;
	actions: JobDiffViewProps['actions'];
	onAction: (arg: JobAction) => void;
	onViewedChange: () => void;
	onViewTypeChange: (viewType: 'inline' | 'side-by-side') => void;
	onReportIssue(): void;
}>;

export const Header = ({
	diff,
	title,
	jobKind,
	newFileTitle,
	oldFileTitle,
	children,
	viewed,
	actions,
	onViewedChange,
	onAction,
	onReportIssue,
}: HeaderProps) => {
	const shouldShowDiff = diff && showDiff(jobKind as unknown as JobKind);
	return (
		<div className="flex w-full items-center container-header">
			<div className="flex flex-row flex-1 justify-between flex-wrap">
				<div className="flex items-center">
					<Popup
						trigger={
							<h4 className="my-0 ml-3 diff-title align-self-center">
								{title}
							</h4>
						}
						position={['top left', 'right center']}
						lockScroll
						on={['hover', 'focus']}
					>
						<div>
							{getJobTitle(
								jobKind as unknown as JobKind,
								newFileTitle,
								oldFileTitle,
							)}
						</div>
					</Popup>

					<h4 className="ml-3 my-0"> {newFileTitle} </h4>
				</div>

				<div
					className="flex gap-4"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<VSCodeButton
						appearance="secondary"
						onClick={onReportIssue}
					>
						Report Issue
					</VSCodeButton>
					{shouldShowDiff && (
						<div className="ml-10 flex items-center justify-end diff-changes-container">
							<span className="diff-changes diff-added">
								+{diff.added}
							</span>

							<span> / </span>

							<span className="diff-changes diff-removed">
								-{diff.removed}
							</span>
						</div>
					)}
					{actions &&
						actions?.map((el) => (
							<VSCodeButton
								onClick={() => onAction(el)}
								appearance="secondary"
								key={el.command}
							>
								{el.title}
							</VSCodeButton>
						))}
					<div
						className="flex ml-10 justify-between checkbox-container items-center"
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

const showDiff = (jobKind: JobKind): boolean => {
	switch (jobKind) {
		case JobKind.copyFile:
		case JobKind.moveFile:
		case JobKind.deleteFile:
			return false;
		default:
			return true;
	}
};

const getJobTitle = (
	jobKind: JobKind,
	oldFileTitle: string,
	newFileContent: string,
): string => {
	switch (jobKind) {
		case JobKind.copyFile:
			return `Copy ${oldFileTitle} to ${newFileContent}`;
		case JobKind.createFile:
			return `Create new File ${newFileContent}`;
		case JobKind.deleteFile:
			return `Delete File`;
		case JobKind.moveAndRewriteFile:
			return `Move and Rewrite ${oldFileTitle} to ${newFileContent}`;
		case JobKind.moveFile:
			return `Move ${oldFileTitle} to ${newFileContent}`;
		case JobKind.rewriteFile:
			return `Modified Contet of ${oldFileTitle} `;
		default:
			throw new Error('Unknown job kind');
	}
};
