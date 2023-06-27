import Popover from '../../shared/Popover';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as EditMaterialIcon } from '../../assets/material-icons/edit.svg';

import s from './style.module.css';
import { memo } from 'react';

type Props = {
  value: string;
	repoName: string;
	notEnoughSpace: boolean;
	onDoubleClick(e: React.MouseEvent): void;
};

const DirectorySelectorTrigger = ({
	value,
	repoName,
  notEnoughSpace,
	onDoubleClick
}: Props) => {
  const displayValue = notEnoughSpace ? (
		<EditMaterialIcon
			style={{
				width: '16px',
				height: '16px',
			}}
		/>
	) : (
		value
	);
  
	return (
		<Popover
			trigger={
				<VSCodeButton
					appearance="icon"
					onDoubleClick={(event) => {
						event.stopPropagation();
						onDoubleClick(event);
					}}
					className={s.targetPathButton}
				>
					<span className={s.label}>
            {/* @TODO fix this */}
						{typeof displayValue === 'string' ? (
							displayValue === `${repoName}/` ? (
								<em>{`${repoName}/`}</em>
							) : (
								displayValue
									.split('/')
									.filter((part) => part.length !== 0)
									.slice(-1)[0]
							)
						) : (
							displayValue
						)}
					</span>
				</VSCodeButton>
			}
			popoverText="Codemod's target path. Double-click to edit."
		/>
	);
};

export default memo(DirectorySelectorTrigger);