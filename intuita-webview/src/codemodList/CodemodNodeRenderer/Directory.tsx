import cn from 'classnames';
import s from './style.module.css';
import { memo } from 'react';
import { ReactComponent as VerifiedMaterialIcon } from '../../assets/material-icons/verified.svg';
import Popover from '../../shared/Popover';

const Directory = (
	props: Readonly<{
		expanded: boolean;
		label: string;
		intuitaCertified: boolean;
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
					{props.intuitaCertified && (
						<Popover
							trigger={
								<span style={{ display: 'flex' }}>
									<VerifiedMaterialIcon
										fill="var(--vscode-focusBorder)"
										width={17}
										height={17}
										style={{ marginLeft: '2px' }}
									/>
								</span>
							}
							popoverText="This library consists of high-quality, Intuita-verified codemods."
						/>
					)}
				</span>
			</div>
		</>
	);
};

export default memo(Directory);
