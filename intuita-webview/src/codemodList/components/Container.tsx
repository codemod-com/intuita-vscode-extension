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
	children,
	headerTitle,
}: {
	children: React.ReactNode;
	headerTitle: string;
}) => {
	const [expanded, setExpanded] = useState(true);

	return (
		<div
			className={cn('container', {
				containerCollapsed: !expanded,
			})}
		>
			<Collapsable
				className="codemodListCollapsible"
				headerChevronClassName="codemodlistCollapsableArrow"
				headerClassName="collapsableHeader"
				contentClassName="collpasableContent"
				onToggle={(expanded) => setExpanded(expanded)}
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
