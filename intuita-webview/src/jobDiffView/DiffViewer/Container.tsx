import React from 'react';
import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import './container.css';
import { useWindowSize } from '../hooks/useWindowSize';

type DiffHeaderProps = {
	viewType: 'inline' | 'side-by-side';
	onViewTypeChange: (viewType: 'inline' | 'side-by-side') => void;
};

const DiffHeader = ({ viewType, onViewTypeChange }: DiffHeaderProps) => {
	return (
		<div className="flex flex-row container-header flex-wrap justify-between">
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
				<VSCodeOption value="side-by-side"> Side By Side </VSCodeOption>
			</VSCodeDropdown>
		</div>
	);
};

export const Container = ({
	children,
	viewType,
	onViewTypeChange,
}: { children: React.ReactNode } & DiffHeaderProps) => {
	const { width } = useWindowSize();
	return (
		<div
			className="flex flex-wrap w-full container flex-col"
			style={{ width }}
		>
			<DiffHeader
				viewType={viewType}
				onViewTypeChange={onViewTypeChange}
			/>
			<div className="flex flex-wrap flex-col w-full">{children}</div>
		</div>
	);
};
