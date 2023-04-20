import React, { forwardRef } from 'react';
import {
	VSCodeButton,
	VSCodeCheckbox,
	VSCodeDropdown,
	VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import './Container.css';
import { JobAction, JobDiffViewProps } from '../../shared/types';
import { JobKind } from '../../shared/constants';
import { Diff } from './Diff';

type ContainerProps = Readonly<{
	oldFileName: string | null;
	newFileName: string | null;
	viewType: 'inline' | 'side-by-side';
	onViewTypeChange: (viewType: 'inline' | 'side-by-side') => void;
	children?: React.ReactNode;
}>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	(
		{
			oldFileName,
			newFileName,
			children,
			viewType,
			onViewTypeChange,
		}: ContainerProps,
		ref,
	) => {
		const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e.target as HTMLSelectElement).value as
				| 'inline'
				| 'side-by-side';
			onViewTypeChange(value);
		};
		return (
			<div
				className="flex  flex-wrap w-full container flex-col"
				ref={ref}
			>
				<div className="mb-10">
					<VSCodeDropdown
						style={{ zIndex: 10001 }}
						value={viewType}
						onChange={handleChange}
					>
						<VSCodeOption value="inline"> Inline </VSCodeOption>
						<VSCodeOption value="side-by-side">
							Side By Side
						</VSCodeOption>
					</VSCodeDropdown>
				</div>

				{viewType === 'side-by-side' && newFileName && oldFileName && (
					<div className="flex flex-row w-full">
						<div className="w-half ml-50">
							<h3>{oldFileName}</h3>
						</div>
						<div className="w-half ml-50">
							<h3>{newFileName}</h3>
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
	onViewTypeChange: (viewType: 'inline' | 'side-by-side') => void;
	viewed?: boolean;
	onViewedChange: () => void;
	children?: React.ReactNode;
	actions: JobDiffViewProps['actions'];
	onAction: (arg: JobAction) => void;
}>;

export const Header = ({
	diff,
	title,
	jobKind,
	newFileTitle,
	oldFileTitle,
	children,
	viewed,
	onViewedChange,
	actions,
	onAction,
}: HeaderProps) => {
	return (
		<div className="f p-10 flex  w-full items-center container-header">
			<div className="flex flex-row flex-1  justify-between flex-wrap">
				<div className="flex items-center ">
					<h3
						className="my-0 ml-3 diff-title align-self-center"
						title={getJobTitle(
							jobKind as unknown as JobKind,
							newFileTitle,
							oldFileTitle,
						)}
					>
						{title}
					</h3>
					<h3 className="ml-3 my-0"> {newFileTitle} </h3>
				</div>

				<div
					className="flex gap-4"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{diff && (
						<div className="ml-10 flex items-center">
							{diff && diff.added > 0 && (
								<span className="diff-changes diff-added">
									+{diff.added}
								</span>
							)}
							{diff && diff.added > 0 && diff.removed > 0 && (
								<span> / </span>
							)}
							{diff && diff.removed > 0 && (
								<span className="diff-changes diff-removed">
									-{diff.removed}
								</span>
							)}
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

const getJobTitle = (
	jobKind: JobKind,
	oldFileTitle: string,
	newFileContent: string,
): string => {
	switch (jobKind) {
		case JobKind.copyFile:
			return `Copy ${oldFileTitle} to ${newFileContent}`;
		case JobKind.createFile:
			return `Create ${newFileContent}`;
		case JobKind.deleteFile:
			return `Delete ${oldFileTitle} `;
		case JobKind.moveAndRewriteFile:
			return `Move and Rewrite ${oldFileTitle} to ${newFileContent}`;
		case JobKind.moveFile:
			return `Move ${oldFileTitle} to ${newFileContent}`;
		case JobKind.rewriteFile:
			return `Rewrite ${oldFileTitle} `;
		default:
			throw new Error('Unknown job kind');
	}
};
