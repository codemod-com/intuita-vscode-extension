import { CSSProperties, ReactNode, useLayoutEffect, useRef } from 'react';
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
	onClick(event: React.MouseEvent<HTMLDivElement>): void;
	depth: number;
	inlineStyles?: {
		root?: CSSProperties;
		icon?: CSSProperties;
		label?: CSSProperties;
		subLabel?: CSSProperties;
		actions?: CSSProperties;
	};
	onPressChevron?(event: React.MouseEvent<HTMLSpanElement>): void;
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
	inlineStyles,
	onPressChevron,
}: Props) => {
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (focused) {
			ref.current?.focus();
		}
	}, [focused]);

	return (
		<div
			key={id}
			ref={ref}
			tabIndex={0}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
			style={inlineStyles?.root}
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
			<div className={styles.icon} style={inlineStyles?.icon}>
				{icon}
			</div>
			<span className={styles.label} style={inlineStyles?.label}>
				{label}
			</span>
			{subLabel.length > 0 ? (
				<span
					className={styles.subLabel}
					style={inlineStyles?.subLabel}
				>
					{subLabel}
				</span>
			) : null}
			<div className={styles.actions} style={inlineStyles?.actions}>
				{actionButtons}
			</div>
		</div>
	);
};

export default TreeItem;
