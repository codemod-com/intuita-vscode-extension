import React, { forwardRef } from 'react';
import {
	VSCodeCheckbox,
	VSCodeDropdown,
	VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import './Container.css';

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
				<div className='mb-10' >
					<VSCodeDropdown
						value={viewType}
						selectedIndex={viewType === 'inline' ? 0 : 1}
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
	title: string;
	viewType: 'inline' | 'side-by-side';
	onViewTypeChange: (viewType: 'inline' | 'side-by-side') => void;
	viewed?: boolean;
	onViewedChange: () => void;
	children?: React.ReactNode;
}>;

export const Header = ({ title, children , viewed , onViewedChange }: HeaderProps) => {
	return (
		<div className="f p-10 flex  w-full items-center container-header">
			<div className="flex flex-row flex-1  justify-between flex-wrap">
				<h3 className="my-0 ml-3 align-self-center"> {title} </h3>
				<div
					className="flex ml-10 justify-between checkbox-container items-center"
					onClick={(e) => {
						e.stopPropagation();
						onViewedChange()
					}}
				>
					<VSCodeCheckbox checked={viewed}  />
					<p className="my-0 ml-10">Viewed</p>
				</div>
			</div>
			{children}
		</div>
	);
};
