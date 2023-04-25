import { useState, useRef, useCallback, useEffect } from 'react';
import { Container, Header } from './Container';
import { JobDiffViewProps } from '../App';
import {
	Collapsable,
	CollapsableRefMethods,
} from '../../shared/Collapsable/Collapsable';
import { useDiffViewer } from './Diff';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { DiffViewType } from '../../shared/types';

type Props = JobDiffViewProps & {
	postMessage: (arg: JobAction) => void;
	ViewType: 'inline' | 'side-by-side';
};
export const JobDiffView = ({
	ViewType,
	actions,
	jobHash,
	jobKind,
	oldFileContent,
	newFileContent,
	oldFileTitle,
	newFileTitle,
	title,
	postMessage,
}: Props) => {
	const collapsableRef = useRef<CollapsableRefMethods>(null);
	const [viewType, setViewType] = useState<DiffViewType>(ViewType);

	useEffect(() => {
		setViewType(ViewType);
	}, [ViewType]);

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

	const onAction = (action: JobAction) => {
		postMessage(action);
	};
	const { diff, diffViewer } = useDiffViewer({
		viewType,
		oldFileTitle,
		newFileTitle,
		jobKind,
		oldFileContent,
		newFileContent,
		jobHash,
		title,
	});

	return (
		<Collapsable
			ref={collapsableRef}
			defaultExpanded={true}
			className="overflow-hidden my-10 rounded "
			headerClassName="p-10"
			contentClassName="p-10"
			headerSticky
			headerComponent={
				<Header
					diff={diff}
					oldFileTitle={oldFileTitle ?? ''}
					newFileTitle={newFileTitle ?? ''}
					jobKind={jobKind}
					onViewedChange={toggleViewed}
					viewed={!isVisible}
					onAction={onAction}
					actions={actions}
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
			>
				{diffViewer}
			</Container>
		</Collapsable>
	);
};
