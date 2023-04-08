import { ReactNode } from 'react';
import styles from './style.module.css';
import cn from 'classnames';

type Props = {
	id: string;
	label: string;
	open: boolean;
	icon: ReactNode;
	actionButtons: ReactNode;
	onClick(): void;
};

const TreeItem = ({ id,  label, icon, actionButtons, open, onClick}: Props) => {
	return (
		<div id={id} className={styles.root} onClick={onClick}>
			<i className={cn('codicon', {
				'chevron-right': !open, 
				'chevron-down': open,
			})} />
			<div className={styles.icon}>{icon}</div>
			<span className={styles.label}>{label}</span>
			<div className={styles.actions}>{actionButtons}</div>
		</div>
	);
};

export default TreeItem;
