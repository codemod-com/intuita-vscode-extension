import { useEffect, useMemo, useRef, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { DiffViewType, JobHash } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';
import {
	List,
	_List,
	CellMeasurerCache,
	CellMeasurer,
} from '../_reactVirtualized';

import Header from './Header';
import { vscode } from '../../shared/utilities/vscode';
import { Diff } from './Diff';
import { useElementSize } from '../hooks/useElementSize';
import { useTheme } from '../../shared/Snippet/useTheme';

type JobDiffViewContainerProps = Readonly<{
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
	title: string;
	diffId: string;
	scrollIntoHash: JobHash | null;
	stagedJobs: JobHash[];
	showHooksCTA: boolean;
}>;

type DiffItem = Readonly<{
	visible: boolean;
	diff: Diff | null;
	height: number | null;
	containerHeight: number;
	expanded: boolean;
}>;
type DiffData = Record<JobHash, DiffItem>;

const defaultHeight = 1200;

export const JobDiffViewContainer = ({
	title,
	jobs,
	diffId,
	postMessage,
	scrollIntoHash,
	stagedJobs,
	showHooksCTA,
}: JobDiffViewContainerProps) => {
	const reversedJobs = useMemo(() => jobs.reverse(), [jobs]);

	const listRef = useRef<_List>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [diffData, setDiffData] = useState<DiffData>(() =>
		reversedJobs.reduce((acc, el) => {
			acc[el.jobHash] = {
				visible: true,
				diff: null,
				height: defaultHeight,
				expanded: true,
				containerHeight: 50,
			};
			return acc;
		}, {} as DiffData),
	);
	const prevDiffData = useRef<DiffData>(diffData);

	const cache = useRef(
		new CellMeasurerCache({
			fixedWidth: true,
			fixedHeight: false,
			defaultHeight: 50,
		}),
	);

	useEffect(() => {
		if (!scrollIntoHash) {
			return;
		}
		const index = reversedJobs.findIndex(
			(job) => job.jobHash === scrollIntoHash,
		);
		if (index === -1) {
			return;
		}
		listRef.current?.scrollToRow(index);
	}, [reversedJobs, scrollIntoHash]);

	useEffect(() => {
		cache.current.clearAll();
		const diffData = reversedJobs.reduce((acc, el) => {
			acc[el.jobHash] = {
				visible: true,
				diff: null,
				height: defaultHeight,
				expanded: true,
				containerHeight: 50,
			};
			return acc;
		}, {} as DiffData);
		prevDiffData.current = diffData;
		setDiffData(diffData);
		listRef.current?.measureAllRows();
	}, [reversedJobs]);
	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});
	const theme = useTheme();

	useEffect(() => {
		for (const data of Object.entries(diffData)) {
			const jobHash = data[0] as JobHash;
			const prevData = prevDiffData.current?.[jobHash];
			if (!prevData) {
				continue;
			}
			if (
				prevData.height !== data[1].height ||
				prevData.expanded !== data[1].expanded
			) {
				const index = reversedJobs.findIndex(
					(job) => job.jobHash === jobHash,
				);
				if (index === -1) {
					return;
				}
				cache.current?.clear(index, 0);
				listRef.current?.recomputeRowHeights(index);
			}
		}
		prevDiffData.current = diffData;
	}, [diffData, reversedJobs]);

	const { width, height } = useElementSize(containerRef);

	const toggleVisible = (jobHash: JobHash) => {
		const copy = { ...diffData };
		if (!copy[jobHash]) {
			return;
		}
		setDiffData((data) => {
			const copy = { ...data };
			if (!copy[jobHash]) {
				return data;
			}
			return {
				...copy,
				[jobHash]: {
					...copy[jobHash],
					visible: !copy[jobHash]?.visible,
					expanded: !copy[jobHash]?.visible,
				},
			};
		});
		const index = reversedJobs.findIndex((job) => job.jobHash === jobHash);
		if (index === -1) {
			return;
		}
	};

	const onToggle = (jobHash: JobHash, expanded: boolean) => {
		const copy = { ...diffData };
		if (!copy[jobHash]) {
			return;
		}
		setDiffData((data) => {
			const copy = { ...data };
			if (!copy[jobHash]) {
				return data;
			}
			return {
				...copy,
				[jobHash]: {
					...copy[jobHash],
					expanded,
				},
			};
		});
		const index = reversedJobs.findIndex((job) => job.jobHash === jobHash);
		if (index === -1) {
			return;
		}
	};

	const onHeightSet = (jobHash: JobHash, height: number) => {
		const copy = { ...diffData };
		if (!copy[jobHash]) {
			return;
		}
		setDiffData((data) => {
			const copy = { ...data };
			if (!copy[jobHash]) {
				return data;
			}
			return {
				...copy,
				[jobHash]: {
					...copy[jobHash],
					height,
				},
			};
		});
		const index = reversedJobs.findIndex((job) => job.jobHash === jobHash);
		if (index === -1) {
			return;
		}
	};

	const onDiffCalculated = (jobHash: JobHash, diff: Diff) => {
		const copy = { ...diffData };
		if (!copy[jobHash]) {
			return;
		}
		setDiffData((data) => {
			const copy = { ...data };
			if (!copy[jobHash]) {
				return data;
			}
			return {
				...copy,
				[jobHash]: {
					...copy[jobHash],
					diff,
				},
			};
		});
	};

	const onToggleJob = (jobHash: JobHash) => {
		const stagedJobsSet = new Set(stagedJobs);

		if (stagedJobsSet.has(jobHash)) {
			stagedJobsSet.delete(jobHash);
		} else {
			stagedJobsSet.add(jobHash);
		}

		vscode.postMessage({
			kind: 'webview.global.stageJobs',
			jobHashes: Array.from(stagedJobsSet),
		});
	};

	return (
		<div className="w-full h-full flex flex-col">
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				title={title}
				jobs={reversedJobs}
				diffId={diffId}
				stagedJobsHashes={stagedJobs}
				showHooksCTA={showHooksCTA}
			/>
			<div className="w-full pb-2-5 h-full" ref={containerRef}>
				<List
					scrollToAlignment="start"
					height={height}
					ref={listRef}
					columnWidth={cache.current.columnWidth}
					deferredMeasurementCache={cache.current}
					width={width}
					rowHeight={cache.current.rowHeight}
					overscanRowCount={6}
					rowCount={reversedJobs.length}
					rowRenderer={({ index, style, parent, key }) => {
						const el = reversedJobs[index];
						if (!el) {
							return null;
						}
						return (
							<CellMeasurer
								cache={cache.current}
								columnIndex={0}
								key={key}
								parent={parent}
								rowIndex={index}
							>
								{({ registerChild }) => {
									return (
										<div
											style={style}
											id={el.newFileTitle ?? ''}
										>
											<JobDiffView
												theme={theme}
												containerRef={registerChild}
												onToggle={(expanded) => {
													onToggle(
														el.jobHash,
														expanded,
													);
												}}
												expanded={
													diffData[el.jobHash]
														?.expanded ?? false
												}
												toggleVisible={toggleVisible}
												diff={
													diffData[el.jobHash]
														?.diff ?? null
												}
												visible={
													diffData[el.jobHash]
														?.visible ?? true
												}
												ViewType={viewType}
												key={el.jobHash}
												postMessage={postMessage}
												jobStaged={stagedJobs.includes(
													el.jobHash,
												)}
												onToggleJob={() =>
													onToggleJob(el.jobHash)
												}
												height={
													diffData[el.jobHash]
														?.height ??
													defaultHeight
												}
												onHeightSet={(height) => {
													onHeightSet(
														el.jobHash,
														height,
													);
												}}
												onDiffCalculated={
													onDiffCalculated
												}
												{...el}
											/>
										</div>
									);
								}}
							</CellMeasurer>
						);
					}}
				/>
			</div>
		</div>
	);
};
