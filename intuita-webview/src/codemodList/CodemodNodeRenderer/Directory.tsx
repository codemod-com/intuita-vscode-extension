import cn from 'classnames';
import s from './style.module.css';
import { memo } from 'react';

type Props = Readonly<{
	expanded: boolean;
	childCount: number;
	label: string;
}>;

const Directory = ({ expanded, childCount, label }: Props) => {
	const hasChildren = childCount !== 0;

	return (
		<>
			{hasChildren ? (
				<div className={s.codicon}>
					<span
						className={cn('codicon', {
							'codicon-chevron-right': !expanded,
							'codicon-chevron-down': expanded,
						})}
					/>
				</div>
			) : null}
			<div className={s.icon}>
				<span
					className={cn('codicon', {
						'codicon-folder': !expanded,
						'codicon-folder-opened': expanded,
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
						{label}
					</span>
				</span>
			</div>
		</>
	);
};

export default memo(Directory);
