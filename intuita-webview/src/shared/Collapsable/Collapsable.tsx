import React, {
	forwardRef,
	memo,
	useImperativeHandle,
	useRef,
} from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/arrow-down.svg';
import './Collapsable.css';
import cn from 'classnames';

type CollapsableProps = Readonly<{
	id: string;
	expanded: boolean;
	headerComponent: React.ReactNode;
	headerClassName?: string;
	headerChevronClassName?: string;
	headerSticky?: boolean;
	children: React.ReactNode;
	contentClassName?: string;
	className?: string;
	onToggle: (expanded: boolean) => void;
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
				expanded,
				onToggle,
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
			const containerRef = useRef<HTMLDivElement>(null);
			
			useImperativeHandle(ref, () => ({
				expanded,
				collapse: () => onToggle(false),
				expand: () => onToggle(true),
				getHeight: () => containerRef.current?.clientHeight ?? 0,
			}));

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
						onClick={() => onToggle(!expanded)}
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
