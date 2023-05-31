import cn from 'classnames';
import { Collapsable } from '../../shared/Collapsable/Collapsable';
import './Container.css';

type Props = Readonly<{
	className?: string;
	children: React.ReactNode;
	headerTitle: string;
	expanded: boolean;
	setExpanded: (expanded: boolean) => void;
}>;

export const Container = ({
	className,
	children,
	headerTitle,
	expanded,
	setExpanded,
}: Props) => {
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
				contentClassName="collapsableContent"
				onToggle={setExpanded}
				defaultExpanded={expanded}
				headerComponent={
					<div className="header">
						<p>{headerTitle}</p>
					</div>
				}
			>
				{children}
			</Collapsable>
		</div>
	);
};
