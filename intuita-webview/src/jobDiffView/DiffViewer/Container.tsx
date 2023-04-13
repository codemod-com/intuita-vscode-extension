import React from 'react';
import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';

type ContainerProps = {
	title: string;
	oldFileName: string | null;
	newFileName: string | null;
	viewType: 'inline' | 'side-by-side';
	onViewTypeChange: (viewType: 'inline' | 'side-by-side') => void;
	children: React.ReactNode;
};

export const Container = ({
	title,
	oldFileName,
	newFileName,
	children,
	viewType,
	onViewTypeChange,
}: ContainerProps) => {
	return (
		<div className="flex  flex-wrap w-full container flex-col">
			<div className="f p-10  container-header">
				<VSCodeDropdown
					value={viewType}
					selectedIndex={viewType === 'inline' ? 0 : 1}
					onChange={(e) => {
						const value = (e.target as HTMLSelectElement).value as
							| 'inline'
							| 'side-by-side';
						onViewTypeChange(value);
					}}
				>
					<VSCodeOption value="inline"> Inline </VSCodeOption>
					<VSCodeOption value="side-by-side">
						Side By Side
					</VSCodeOption>
				</VSCodeDropdown>
				<div className="flex flex-row flex-wrap">
					<h3> {title} </h3>
				</div>
			</div>

			{viewType === 'side-by-side' && newFileName && oldFileName && (
				<div className="flex flex-row flex-wrap w-full">
					<div className="w-half">
						<h3>{oldFileName}</h3>
					</div>
					<div className="w-half">
						<h3>{newFileName}</h3>
					</div>
				</div>
			)}

			<div className="flex flex-wrap flex-col w-full">{children}</div>
		</div>
	);
};
