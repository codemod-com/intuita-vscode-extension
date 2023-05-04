import React, {
	forwardRef,
	useEffect,
	memo,
	useImperativeHandle,
	useState,
	useRef,
} from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/arrow-down.svg';
import './Collapsable.css';
import cn from 'classnames';

type CollapsableProps = Readonly<{
	id: string;
	defaultExpanded: boolean;
	headerComponent: React.ReactNode;
	headerClassName?: string;
	headerChevronClassName?: string;
	headerSticky?: boolean;
	children: React.ReactNode;
	contentClassName?: string;
	className?: string;
	onToggle?: (expanded: boolean) => void;
}>;

export type CollapsableRefMethods = Readonly<{
	expanded: boolean;
	collapse: () => void;
	expand: () => void;
	getHeight: () => number;
}>;

export const Collapsable = memo(
	forwardRef<CollapsableRefMethods, CollapsableProps>(
		(
			{
				id,
				onToggle,
				defaultExpanded: defaultCollapsed,
				headerSticky,
				headerComponent,
				headerClassName,
				headerChevronClassName,
				contentClassName,
				className,
				children,
			},
			ref,
		) => {
			const [expanded, setExpanded] = useState(defaultCollapsed);
			const containerRef = useRef<HTMLDivElement>(null);
console.log('reloading ....')
			useImperativeHandle(ref, () => ({
				expanded,
				collapse: () => setExpanded(false),
				expand: () => setExpanded(true),
				getHeight: () => containerRef.current?.clientHeight ?? 0,
			}));

			useEffect(() => {
				onToggle?.(expanded);
			}, [expanded, onToggle]);

			return (
				<div
					className={cn('collapsable', className)}
					ref={containerRef}
					id={id}
				>
					<div
						className={cn(headerClassName, {
							collapsable__header: true,
							'collapsable__header--sticky': headerSticky,
						})}
						onClick={() => setExpanded(!expanded)}
					>
						<ArrowDownIcon
							className={cn(
								'collapsable__arrow',
								headerChevronClassName,
								{
									'collapsable__arrow--collapsed': !expanded,
								},
							)}
						/>
						{headerComponent}
					</div>
					{expanded && (
						<div
							className={cn(
								'collapsable_content',
								contentClassName,
							)}
						>
							{children}
						</div>
					)}
				</div>
			);
		},
	),
);
