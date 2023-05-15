import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { JobDiffViewProps } from '../App';
import { JobAction } from '../../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffItem';
import { DiffViewType, JobHash } from '../../shared/types';
import { useCTLKey } from '../hooks/useKey';
import {
	List,
	CellMeasurerCache,
	CellMeasurer,
	ListProps,
	CellMeasurerProps,
} from 'react-virtualized';

import Header from './Header';
import { vscode } from '../../shared/utilities/vscode';
import { Diff } from './Diff';
import { useElementSize } from '../hooks/useElementSize';
import { useTheme } from '../../shared/Snippet/useTheme';

const ListComponent = List as unknown as FC<ListProps>;
const CellMeasurerComponent = CellMeasurer as unknown as FC<CellMeasurerProps>;

type JobDiffViewContainerProps = Readonly<{
	postMessage: (arg: JobAction) => void;
	jobs: JobDiffViewProps[];
	diffId: string;
	scrollIntoHash: JobHash | null;
	scrollIntoFolderPath: string | null;
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
	jobs,
	diffId,
	postMessage,
	scrollIntoHash,
	scrollIntoFolderPath,
	stagedJobs,
	showHooksCTA,
}: JobDiffViewContainerProps) => {
	const sortedJobs = useMemo(() => jobs, [jobs]);

	const listRef = useRef<List>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [viewType, setViewType] = useState<DiffViewType>('side-by-side');
	const [diffData, setDiffData] = useState<DiffData>(() =>
		sortedJobs.reduce((acc, el) => {
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
		if ((!scrollIntoHash && !scrollIntoFolderPath) || !listRef.current) {
			return;
		}
		const index = sortedJobs.findIndex(
			(job) =>
				(scrollIntoHash && job.jobHash === scrollIntoHash) ||
				(scrollIntoFolderPath &&
					job.newFileTitle?.includes(scrollIntoFolderPath)),
		);

		if (index === -1) {
			return;
		}

		for (let i = 0; i < Math.ceil(sortedJobs.length / 6); i++) {
			const element =
				document.getElementsByClassName(
					'ReactVirtualized__Grid__innerScrollContainer',
				)[0] ?? null;

			if (element === null) {
				return;
			}

			const children = Array.from(element.children);

			const diffViewToFocus = children.find(
				(child) => child.id === `${index}`,
			);

			if (diffViewToFocus) {
				diffViewToFocus?.scrollIntoView();
				return;
			}

			const lastRenderedChild = children[children.length - 1];

			if (!lastRenderedChild) {
				return;
			}

			lastRenderedChild.scrollIntoView();

			// last diff item is reached
			if (lastRenderedChild.id === `${sortedJobs.length - 1}`) {
				return;
			}
		}
	}, [sortedJobs, scrollIntoHash, scrollIntoFolderPath]);

	useEffect(() => {
		cache.current.clearAll();
		const diffData = sortedJobs.reduce((acc, el) => {
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
	}, [sortedJobs]);

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
				const index = sortedJobs.findIndex(
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
	}, [diffData, sortedJobs]);

	const { width, height } = useElementSize(containerRef);

	const toggleVisible = useCallback(
		(jobHash: JobHash) => {
			setDiffData((prevDiffData) => {
				const diffItem = prevDiffData[jobHash];

				if (diffItem === undefined) {
					return prevDiffData;
				}

				return {
					...prevDiffData,
					[jobHash]: {
						...diffItem,
						visible: !diffItem?.visible,
						expanded: !diffItem?.visible,
					},
				};
			});
		},
		[setDiffData],
	);

	const onToggle = useCallback(
		(jobHash: JobHash, expanded: boolean) => {
			setDiffData((prevDiffData) => {
				// @TODO fix code duplication
				if (!prevDiffData[jobHash]) {
					return prevDiffData;
				}

				return {
					...prevDiffData,
					[jobHash]: {
						...prevDiffData[jobHash],
						expanded,
					},
				};
			});
		},
		[setDiffData],
	);

	const onHeightSet = useCallback(
		(jobHash: JobHash, height: number) => {
			setDiffData((prevDiffData) => {
				if (!prevDiffData[jobHash]) {
					return prevDiffData;
				}

				return {
					...prevDiffData,
					[jobHash]: {
						...prevDiffData[jobHash],
						height,
					},
				};
			});
		},
		[setDiffData],
	);

	const onDiffCalculated = useCallback(
		(jobHash: JobHash, diff: Diff) => {
			setDiffData((prevDiffData) => {
				if (!prevDiffData[jobHash]) {
					return prevDiffData;
				}

				return {
					...prevDiffData,
					[jobHash]: {
						...prevDiffData[jobHash],
						diff,
					},
				};
			});
		},
		[setDiffData],
	);

	const onToggleJob = useCallback(
		(jobHash: JobHash) => {
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
		},
		[stagedJobs],
	);

	return (
		<div className="w-full h-full flex flex-col">
			<Header
				onViewChange={setViewType}
				viewType={viewType}
				jobs={sortedJobs}
				diffId={diffId}
				stagedJobsHashes={stagedJobs}
				showHooksCTA={showHooksCTA}
			/>
			<div className="w-full pb-2-5 h-full" ref={containerRef}>
				<ListComponent
					scrollToAlignment="start"
					height={height}
					ref={listRef}
					columnWidth={cache.current.columnWidth}
					deferredMeasurementCache={cache.current}
					width={width}
					rowHeight={cache.current.rowHeight}
					overscanRowCount={10}
					rowCount={sortedJobs.length}
					rowRenderer={({ index, style, parent, key }) => {
						const el = sortedJobs[index];
						if (!el) {
							return null;
						}
						return (
							<CellMeasurerComponent
								cache={cache.current}
								columnIndex={0}
								key={key}
								parent={parent}
								rowIndex={index}
							>
								{({ registerChild }) => {
									const diffItem = diffData[el.jobHash];

									if (diffItem === undefined) {
										return null;
									}

									const { expanded, diff, visible, height } =
										diffItem;

									return (
										<div
											style={style}
											id={`${index}`}
											key={el.jobHash}
										>
											<JobDiffView
												ref={registerChild}
												theme={theme}
												expanded={expanded}
												diff={diff}
												visible={visible}
												viewType={viewType}
												jobStaged={stagedJobs.includes(
													el.jobHash,
												)}
												height={height ?? defaultHeight}
												onToggle={onToggle}
												toggleVisible={toggleVisible}
												postMessage={postMessage}
												onToggleJob={onToggleJob}
												onHeightSet={onHeightSet}
												onDiffCalculated={
													onDiffCalculated
												}
												{...el}
											/>
										</div>
									);
								}}
							</CellMeasurerComponent>
						);
					}}
				/>
			</div>
		</div>
	);
};
