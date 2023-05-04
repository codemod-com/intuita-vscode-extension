import { useRef, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { DiffViewType, JobHash } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';
import {
	List,
	CellMeasurerCache,
	CellMeasurer,
	WindowScroller,
} from '../_reactVirtualized';

import Header from './Header';
import { vscode } from '../../shared/utilities/vscode';
import { Diff } from './Diff';

type JobDiffViewContainerProps = {
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
	title: string;
	diffId: string;
};

type DiffItem = {
	visible: boolean;
	diff: Diff | null;
	height: number | null;
	containerHeight: number;
	expanded: boolean;
};
type DiffData = Record<JobHash, DiffItem>;

const defaultHeight = 1200;

export const JobDiffViewContainer = ({
	title,
	jobs,
	diffId,
	postMessage,
}: JobDiffViewContainerProps) => {
	const cache = useRef(
		new CellMeasurerCache({
			fixedWidth: true,
			fixedHeight: false,
			defaultHeight: 50,
		}),
	);

	const listRef = useRef<any>();
	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [diffData, setDiffData] = useState<DiffData>(() =>
		jobs.reduce((acc, el) => {
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
				},
			};
		});
		const index = jobs.findIndex((job) => job.jobHash === jobHash);
		if (index === -1) {
			return;
		}
		listRef.current?.recomputeRowHeights(index);
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
		const index = jobs.findIndex((job) => job.jobHash === jobHash);
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
		const index = jobs.findIndex((job) => job.jobHash === jobHash);
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

	useCTLKey('d', () => {
		setViewType((v) => (v === 'side-by-side' ? 'inline' : 'side-by-side'));
	});

	return (
		<div
			className="w-full h-full flex flex-col "
			id={`diffViewer-${diffId}`}
		>
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				title={title}
				jobs={jobs}
				diffId={diffId}
			/>
			<WindowScroller>
				{({ width, height, isScrolling, scrollTop, onChildScroll }) => (
					<List
						autoHeight
						height={height}
						isScrolling={isScrolling}
						onScroll={onChildScroll}
						// ref={listRef}
						columnWidth={cache.current.columnWidth}
						deferredMeasurementCache={cache.current}
						width={width}
						scrollTop={scrollTop}
						rowHeight={cache.current.rowHeight}
						rowCount={jobs.length}
						rowRenderer={({ index, style, parent, key }) => {
							const el = jobs[index];
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
									{({ measure, registerChild }) => (
										<div style={style}>
											<JobDiffView
												containerRef={registerChild}
												onToggle={(expanded) => {
													onToggle(
														el.jobHash,
														expanded,
													);
													setTimeout(
														() => measure(),
														100,
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
												jobStaged={el.staged}
												onToggleJob={() => {
													const stagedJobs = new Set(
														jobs.filter(
															(job) => job.staged,
														),
													);

													if (stagedJobs.has(el)) {
														stagedJobs.delete(el);
													} else {
														stagedJobs.add(el);
													}

													vscode.postMessage({
														kind: 'webview.global.stageJobs',
														jobHashes: Array.from(
															stagedJobs,
														).map(
															({ jobHash }) =>
																jobHash,
														),
													});
												}}
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
													setTimeout(
														() => measure(),
														100,
													);
												}}
												onDiffCalculated={
													onDiffCalculated
												}
												{...el}
											/>
										</div>
									)}
								</CellMeasurer>
							);
						}}
					/>
				)}
			</WindowScroller>
		</div>
	);
};
