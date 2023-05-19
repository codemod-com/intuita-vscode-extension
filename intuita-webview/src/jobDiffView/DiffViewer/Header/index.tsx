import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';

import HooksCTA from './HooksCTA';

type Props = Readonly<{
	showHooksCTA: boolean;
	viewType: DiffViewType;
	jobs: JobDiffViewProps[];
	onViewChange(value: DiffViewType): void;
}>;

const Header = ({ viewType, onViewChange, showHooksCTA }: Props) => {
	return (
		<div className={styles.root}>
			<div className={styles.buttonGroup}>
				{showHooksCTA ? (
					<HooksCTA style={{ marginRight: '5px' }} />
				) : null}
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
