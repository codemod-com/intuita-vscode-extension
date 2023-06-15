import { ReactNode, forwardRef } from 'react';
import {
	Panel as RResizablePanel,
	ImperativePanelHandle,
	PanelProps,
} from 'react-resizable-panels';

type ResizablePanelProps = {
	children?: ReactNode;
	defaultSize: number;
	minSize: number;
	collapsible?: boolean;
	className?: string;
} & PanelProps;

const ResizablePanel = forwardRef<ImperativePanelHandle, ResizablePanelProps>(
	(props, ref) => {
		const {
			children,
			defaultSize,
			minSize,
			collapsible,
			className,
			...rest
		} = props;
		return (
			<RResizablePanel
				{...rest}
				className={className}
				collapsible={collapsible}
				defaultSize={defaultSize}
				minSize={minSize}
				ref={ref}
			>
				<div className="w-full h-full overflow-y-auto">{children}</div>
			</RResizablePanel>
		);
	},
);

export { ResizablePanel };
