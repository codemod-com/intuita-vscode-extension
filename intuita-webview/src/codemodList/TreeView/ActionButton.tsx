import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import IntuitaPopover from '../../shared/IntuitaPopover';
import cn from 'classnames';
import s from './style.module.css';
import { CSSProperties } from 'react';

type Props = {
	id?: string;
	content?: string;
	iconName?: string;
	children?: React.ReactNode;
	onClick(e: React.MouseEvent): void;
	disabled?: boolean;
	style?: CSSProperties;
	active?: boolean;
};

const ActionButton = ({
	content,
	disabled,
	iconName,
	children,
	style,
	id,
	active, 
	onClick,
}: Props) => {
	return (
		<IntuitaPopover content={content} disabled={!content}>
			<VSCodeButton
				id={id}
				className={cn(s.action, {[s.active!]: active })}
				appearance="icon"
				onClick={(e) => {
					e.stopPropagation();
					onClick(e);
				}}
				disabled={disabled}
				style={style}
				
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
