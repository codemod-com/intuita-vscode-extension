import cn from 'classnames';
import { Collapsable } from '../../shared/Collapsable/Collapsable';
import './Container.css';
import { ReactNode, useState } from 'react';

type HeaderProps = {
	title: string;
};
export const Header = ({ title }: HeaderProps) => {
	return (
		<div className="header">
			<p>{title}</p>
		</div>
	);
};

export const Container = ({
	className,
	children,
	headerTitle,
	onToggle,
	defaultExpanded,
}: {
	className?: string;
	children: React.ReactNode;
	headerTitle: string;
	defaultExpanded: boolean;
	onToggle?: (toggle: boolean) => void;
}) => {
	const [expanded, setExpanded] = useState(true);

	return (
		<div
			className={cn('container', className, {
				containerCollapsed: !expanded,
			})}
		>
			<Collapsable
				id="codemodListCollapsable"
				className="codemodListCollapsable"
				headerChevronClassName="codemodListCollapsableArrow"
				headerClassName="collapsableHeader"
				contentClassName="collpasableContent"
				onToggle={(expanded) => {
					setExpanded(expanded);
					onToggle?.(expanded);
				}}
				defaultExpanded={defaultExpanded}
				headerComponent={
					headerTitle ? <Header title={headerTitle} /> : null
				}
			>
				{children}
			</Collapsable>
		</div>
	);
};

export const LoadingContainer = ({ children }: { children: ReactNode }) => {
	return <div className="loadingContainer">{children}</div>;
};
