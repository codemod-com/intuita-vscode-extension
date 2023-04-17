import { ReactNode } from 'react';
import styles from './style.module.css';
import cn from 'classnames';

type Props = {
	id: string;
	label: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	actionButtons: ReactNode;
	hasChildren: boolean;
	kind: string;
	onClick(): void;
	depth: number;
};

const TreeItem = ({
	id,
	label,
	icon,
	open,
	focused,
	actionButtons,
	hasChildren,
	kind,
	onClick,
	depth,
}: Props) => {
	return (
		<div
			id={id}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
		>
			<div
				style={{
					...(depth > 0 && {
						// extra margin for job
						minWidth: `${
							5 +
							depth * 16 +
							(hasChildren ||
							[
								'caseByFolderElement',
								'acceptedCaseByFolderElement',
							].includes(kind)
								? 0
								: 16)
						}px`,
					}),
				}}
			/>
			{hasChildren ? (
				<div className={styles.codicon}>
					<span
						className={cn('codicon', {
							'codicon-chevron-right': !open,
							'codicon-chevron-down': open,
						})}
					/>
				</div>
			) : null}
			<div className={styles.icon}>{icon}</div>
			<span className={styles.label}>{label}</span>
			<div className={styles.actions}>{actionButtons}</div>
		</div>
	);
};

export default TreeItem;
