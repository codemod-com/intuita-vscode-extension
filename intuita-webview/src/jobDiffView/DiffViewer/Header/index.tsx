import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';

import cn from 'classnames';
import Popover from '../../../shared/Popover';
import { Dispatch, SetStateAction } from 'react';

type Props = Readonly<{
	viewType: DiffViewType;
	jobs: JobDiffViewProps[];
	onViewChange(value: DiffViewType): void;
	totalJobsCount: number;
	jobIndex: number;
	setJobIndex: Dispatch<SetStateAction<number>>;
}>;

const Header = ({
	viewType,
	onViewChange,
	totalJobsCount,
	jobIndex,
	setJobIndex,
}: Props) => {
	return (
		<div className={styles.root}>
			<div className={styles.actionsContainer}>
				<Popover
					trigger={
						<VSCodeButton
							disabled={jobIndex === 0}
							appearance="icon"
							onClick={() => {
								setJobIndex((prev) => prev - 1);
							}}
						>
							<span
								className={cn('codicon', 'codicon-arrow-left')}
							/>
						</VSCodeButton>
					}
					popoverText="Move to the previous file"
				/>
				<Popover
					trigger={
						<VSCodeButton
							disabled={jobIndex === totalJobsCount - 1}
							appearance="icon"
							onClick={() => {
								setJobIndex((prev) => prev + 1);
							}}
						>
							<span
								className={cn('codicon', 'codicon-arrow-right')}
							/>
						</VSCodeButton>
					}
					popoverText="Move to the next file"
				/>
			</div>
			<div className={styles.buttonGroup}>
				<h4>{`${jobIndex + 1} / ${totalJobsCount}`}</h4>
				{viewType === 'side-by-side' ? (
					<VSCodeButton
						title="Inline"
						appearance="icon"
						onClick={() => onViewChange('inline')}
					>
						Inline <UnifiedIcon className={styles.icon} />
					</VSCodeButton>
				) : (
					<VSCodeButton
						title="Side by Side"
						appearance="icon"
						onClick={() => onViewChange('side-by-side')}
					>
						Side by Side <SplitIcon className={styles.icon} />
					</VSCodeButton>
				)}
			</div>
		</div>
	);
};

export default Header;
