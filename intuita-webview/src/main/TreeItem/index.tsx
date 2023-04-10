import { ReactNode } from 'react';
import styles from './style.module.css';
import cn from 'classnames';

type Props = {
	id: string;
	label: string;
	open: boolean;
	icon: ReactNode;
	actionButtons: ReactNode;
	hasChildren: boolean;
	indent: number;
	onClick(): void;
};

const TreeItem = ({
	id,
	label,
	icon,
	open,
	actionButtons,
	hasChildren,
	indent,
	onClick,
}: Props) => {
	return (
		<div id={id} className={styles.root} onClick={onClick}>
			<div className={styles.indent} style={{ minWidth: `${indent}px` }} />
			{hasChildren ? (<div className={styles.codicon}>
  					<span
						className={cn('codicon', {
							'codicon-chevron-right': !open,
							'codicon-chevron-down': open,
						})}
					/>
			</div>	) : null}
			<div className={styles.icon}>{icon}</div>
			<span className={styles.label}>{label}</span>
			<div className={styles.actions}>{actionButtons}</div>
		</div>
	);
};

export default TreeItem;
