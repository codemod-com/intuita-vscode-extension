import { forwardRef, useImperativeHandle, useState } from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/arrow-down.svg';
import './Collapsable.css';

type CollapsableProps = {
	defaultExpanded: boolean;
	headerComponent: React.ReactNode;
	headerClassName?: string;
	children: React.ReactNode;
	contentClassName?: string;
	className?: string;
};

export type CollapsableRefMethods = {
	expanded: boolean;
	collapse: () => void;
	expand: () => void;
};

export const Collapsable = forwardRef<CollapsableRefMethods, CollapsableProps>(
	(
		{
			defaultExpanded: defaultCollapsed,
			headerComponent,
			headerClassName,
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

		return (
			<div className={`collapsable ${className ?? ''} `}>
				<div
					className={`collapsable__header ${headerClassName ?? ''} `}
					onClick={() => setExpanded(!expanded)}
				>
					<ArrowDownIcon
						className={`collapsable__arrow ${
							expanded ? 'collapsable__arrow--open' : ''
						}`}
					/>
					{headerComponent}
				</div>
				{expanded && (
					<div
						className={` collapsable_content ${
							contentClassName ?? ''
						}`}
					>
						{children}
					</div>
				)}
			</div>
		);
	},
);
