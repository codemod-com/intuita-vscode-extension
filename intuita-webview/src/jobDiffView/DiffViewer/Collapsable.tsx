import { useState } from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/arrow-down.svg';
import './Collapsable.css';

type CollapsableProps = {
	headerComponent: React.ReactNode;
	headerClassName?: string;
	children: React.ReactNode;
	contentClassName?: string;
	className?: string;
};

export const Collapsable = ({
	headerComponent,
	headerClassName,
	contentClassName,
	className,
	children,
}: CollapsableProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className={`collapsable ${className ?? ''} `}>
			<div
				className={`collapsable__header ${headerClassName ?? ''} `}
				onClick={() => setIsOpen(!isOpen)}
			>
                <ArrowDownIcon className={`collapsable__arrow ${isOpen ? 'collapsable__arrow--open' : ''}`} />
				{headerComponent}
			</div>
			{isOpen && (
				<div className={` collapsable_content ${contentClassName ?? ''}`}>
					{children}
				</div>
			)}
		</div>
	);
};
