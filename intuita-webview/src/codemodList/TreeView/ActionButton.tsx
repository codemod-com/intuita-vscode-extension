import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../shared/Popover';
import cn from 'classnames';
import s from './style.module.css';

type Props = {
	popoverText: string;
	onClick(e: React.MouseEvent): void;
	iconName?: string;
	children?: React.ReactNode;
	keepTooltipInside?: string;
};

const ActionButton = ({
	popoverText,
	iconName,
	children,
	onClick,
	keepTooltipInside,
}: Props) => {
	return (
		<Popover
			trigger={
				<VSCodeButton
					className={s.action}
					appearance="icon"
					onClick={(e) => {
						e.stopPropagation();
						onClick(e);
					}}
				>
					{iconName ? (
						<i className={cn('codicon', 'mr-2', iconName)} />
					) : null}
					{children}
				</VSCodeButton>
			}
			popoverText={popoverText}
			keepTooltipInside={keepTooltipInside}
		/>
	);
};

export default ActionButton;
