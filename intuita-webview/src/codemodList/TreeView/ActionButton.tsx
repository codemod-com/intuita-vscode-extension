import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import IntuitaPopover from '../../shared/IntuitaPopover';
import cn from 'classnames';
import s from './style.module.css';

type Props = {
	content: string;
	iconName?: string;
	children?: React.ReactNode;
	onClick(e: React.MouseEvent): void;
};

const ActionButton = ({ content, iconName, children, onClick }: Props) => {
	return (
		<IntuitaPopover content={content}>
			<VSCodeButton
				className={s.action}
				appearance="icon"
				onClick={(e) => {
					e.stopPropagation();
					onClick(e);
				}}
			>
				{iconName ? (
					<span className={cn('codicon', 'mr-2', iconName)} />
				) : null}
				{children}
			</VSCodeButton>
		</IntuitaPopover>
	);
};

export default ActionButton;
