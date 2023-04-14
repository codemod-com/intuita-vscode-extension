import { useState, useRef } from 'react';
import { useElementSize } from '../hooks/useElementSize';
import { Container, Header } from './Container';
import { JobDiffViewProps } from '../App';
import { JobKind } from '../../shared/constants';
import { Collapsable } from './Collapsable';
import { DiffViewer } from './Diff';

export const JobDiffView = ({
	jobHash,
	jobKind,
	oldFileContent,
	newFileContent,
	oldFileTitle,
	newFileTitle,
	title,
}: JobDiffViewProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { height } = useElementSize<HTMLDivElement>(containerRef);
	console.log('height', height);
	const [viewType, setViewType] = useState<'inline' | 'side-by-side'>(() => {
		return [
			JobKind.copyFile,
			JobKind.moveFile,
			JobKind.deleteFile,
			JobKind.createFile,
		].includes(jobKind as unknown as JobKind)
			? 'inline'
			: 'side-by-side';
	});

	return (
		<Collapsable
			className="m-10 px-10 rounded "
			headerComponent={
				<Header
					title={title ?? ''}
					viewType={viewType}
					onViewTypeChange={setViewType}
				/>
			}
		>
			<Container
				ref={containerRef}
				viewType={viewType}
				oldFileName={oldFileTitle}
				newFileName={newFileTitle}
				onViewTypeChange={setViewType}
			>
				<DiffViewer
					newFileTitle={newFileTitle}
					oldFileTitle={oldFileTitle}
					jobKind={jobKind}
					newFileContent={newFileContent}
					oldFileContent={oldFileContent}
					jobHash={jobHash}
					title={title}
				/>
			</Container>
		</Collapsable>
	);
};
