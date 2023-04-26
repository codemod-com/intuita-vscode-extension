import React, {
	forwardRef,
	useEffect,
	memo,
	useImperativeHandle,
	useState,
} from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/arrow-down.svg';
import './Collapsable.css';
import cn from 'classnames';

type CollapsableProps = Readonly<{
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
}>;

export const Collapsable = memo(
	forwardRef<CollapsableRefMethods, CollapsableProps>(
		(
			{
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

			useImperativeHandle(ref, () => ({
				expanded,
				collapse: () => setExpanded(false),
				expand: () => setExpanded(true),
			}));

			useEffect(() => {
				onToggle?.(expanded);
			}, [expanded, onToggle]);

			return (
				<div className={cn('collapsable', className)}>
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