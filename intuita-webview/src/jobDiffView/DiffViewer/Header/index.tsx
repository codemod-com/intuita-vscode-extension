import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType } from '../../../shared/types';

import styles from './style.module.css';

import cn from 'classnames';
import Popover from '../../../shared/Popover';

type Props = Readonly<{
	viewType: DiffViewType;
	onViewChange(value: DiffViewType): void;
	jobCount: number;
	jobIndex: number;
	changeJob: (direction: 'prev' | 'next') => void;
}>;

export const Header = (props: Props) => {
	return (
		<div className={styles.root}>
			<div className={styles.actionsContainer}>
				<Popover
					trigger={
						<VSCodeButton
							appearance="icon"
							onClick={(event) => {
								event.preventDefault();

								props.changeJob('prev');
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
							appearance="icon"
							onClick={(event) => {
								event.preventDefault();

								props.changeJob('next');
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
				<h4>{`${props.jobIndex + 1} / ${props.jobCount}`}</h4>
				{props.viewType === 'side-by-side' ? (
					<VSCodeButton
						title="Inline"
						appearance="icon"
						onClick={() => props.onViewChange('inline')}
					>
						Inline <UnifiedIcon className={styles.icon} />
					</VSCodeButton>
				) : (
					<VSCodeButton
						title="Side by Side"
						appearance="icon"
						onClick={() => props.onViewChange('side-by-side')}
					>
						Side by Side <SplitIcon className={styles.icon} />
					</VSCodeButton>
				)}
			</div>
		</div>
	);
};
