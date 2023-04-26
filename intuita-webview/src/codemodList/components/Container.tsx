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
}: {
	className?: string;
	children: React.ReactNode;
	headerTitle: string;
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
				className="codemodListCollapsible"
				headerChevronClassName="codemodlistCollapsableArrow"
				headerClassName="collapsableHeader"
				contentClassName="collpasableContent"
				onToggle={(expanded) => {
					setExpanded(expanded);
					onToggle?.(expanded);
				}}
				defaultExpanded={true}
				headerComponent={
					<>{headerTitle && <Header title={headerTitle} />}</>
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
