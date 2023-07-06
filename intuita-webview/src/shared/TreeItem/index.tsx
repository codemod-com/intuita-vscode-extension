import { CSSProperties, ReactNode, useLayoutEffect, useRef } from 'react';
import styles from './style.module.css';
import cn from 'classnames';

export type Props = Readonly<{
	id: string;
	label: string;
	subLabel: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	hasChildren: boolean;
	onClick(event: React.MouseEvent<HTMLDivElement>): void;
	depth: number;
	indent: number;
	startDecorator?: ReactNode;
	endDecorator?: ReactNode;
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
	startDecorator,
	hasChildren,
	onClick,
	indent,
	inlineStyles,
	onPressChevron,
	endDecorator,
}: Props) => {
	const ref = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (focused) {
			const timeout = setTimeout(() => {
				ref.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'center',
				});
			}, 0);

			return () => {
				clearTimeout(timeout);
			};
		}

		return () => {};
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
					minWidth: `${indent}px`,
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
			{startDecorator && (
				<div
					className={styles.startDecorator}
					style={inlineStyles?.actions}
				>
					{startDecorator}
				</div>
			)}
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
			{endDecorator && (
				<div
					className={styles.endDecorator}
					style={inlineStyles?.actions}
				>
					{endDecorator}
				</div>
			)}
		</div>
	);
};

export default TreeItem;
