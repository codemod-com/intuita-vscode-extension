import { useState, useRef, useCallback, useEffect } from 'react';
import { Container, Header } from './Container';
import { JobDiffViewProps } from '../App';
import { JobKind } from '../../shared/constants';
import { Collapsable, CollapsableRefMethods } from './Collapsable';
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
	const collapsableRef = useRef<CollapsableRefMethods>(null);
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
	const [isVisible, setVisible] = useState(true);

	const toggleViewed = useCallback(() => {
		setVisible((v) => !v);
	}, [setVisible]);

	useEffect(() => {
		if (isVisible) {
			collapsableRef.current?.expand();
		} else {
			collapsableRef.current?.collapse();
		}
	}, [isVisible]);

	return (
		<Collapsable
			ref={collapsableRef}
			defaultExpanded={true}
			className="m-10 px-10 rounded "
			headerComponent={
				<Header
					viewed={!isVisible}
					onViewedChange={toggleViewed}
					title={title ?? ''}
					viewType={viewType}
					onViewTypeChange={setViewType}
				/>
			}
		>
			<Container
				viewType={viewType}
				oldFileName={oldFileTitle}
				newFileName={newFileTitle}
				onViewTypeChange={setViewType}
			>
				<DiffViewer
					viewType={viewType}
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
