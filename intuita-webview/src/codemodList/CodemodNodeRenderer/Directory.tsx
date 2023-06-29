import cn from 'classnames';
import s from './style.module.css';
import { memo } from 'react';
import Popover from '../../shared/Popover';

const Directory = (
	props: Readonly<{
		expanded: boolean;
		label: string;
	}>,
) => {
	return (
		<>
			<div className={s.codicon}>
				<span
					className={cn('codicon', {
						'codicon-chevron-right': !props.expanded,
						'codicon-chevron-down': props.expanded,
					})}
				/>
			</div>
			<div className={s.icon}>
				<span
					className={cn('codicon', {
						'codicon-folder': !props.expanded,
						'codicon-folder-opened': props.expanded,
					})}
				/>
			</div>
			<div className="flex w-full flex-col">
				<span className={s.labelContainer}>
					<span
						style={{
							userSelect: 'none',
						}}
					>
						{props.label}
					</span>

					<Popover
						trigger={<span style={{ display: 'flex' }}></span>}
						popoverText="This library consists of high-quality, Intuita-verified codemods."
					/>
				</span>
			</div>
		</>
	);
};

export default memo(Directory);
