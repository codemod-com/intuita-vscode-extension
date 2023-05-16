import { CSSProperties, ReactNode, useEffect } from 'react';
import styles from './style.module.css';
import cn from 'classnames';

type Props = Readonly<{
	id: string;
	label: string;
	subLabel: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	actionButtons: ReactNode;
	hasChildren: boolean;
	kind: string;
	onClick(): void;
	depth: number;
	index: number;
	style?: CSSProperties;
	onPressChevron?(): void;
}>;

const TreeItem = ({
	id,
	label,
	subLabel,
	icon,
	open,
	focused,
	actionButtons,
	hasChildren,
	onClick,
	depth,
	style,
	onPressChevron,
}: Props) => {
	useEffect(() => {
		if (focused) {
			document.getElementById(id)?.focus();
		}
	}, [id, focused]);

	return (
		<div
			id={id}
			tabIndex={0}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
			style={style}
		>
			<div
				style={{
					minWidth: `${depth * 18}px`,
				}}
			/>
			{hasChildren ? (
				<div className={styles.codicon}>
					<span
						onClick={onPressChevron}
						className={cn('codicon', {
							'codicon-chevron-right': !open,
							'codicon-chevron-down': open,
						})}
					/>
				</div>
			) : null}
			<div className={styles.icon}>{icon}</div>
			<span className={styles.label}>{label}</span>
			{subLabel.length > 0 ? (
				<span className={styles.subLabel}>{subLabel}</span>
			) : null}
			<div className={styles.actions}>{actionButtons}</div>
		</div>
	);
};

export default TreeItem;
