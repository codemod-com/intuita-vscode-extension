import cn from 'classnames';
import s from './style.module.css';
import { Command } from 'vscode';
import { ReactNode } from 'react';
import { vscode } from '../utilities/vscode';

type Props = {
	title: string;
	open: boolean;
	commands: ReadonlyArray<Command & { icon: string }>;
	children?: ReactNode;
	onHeaderClick?(): void;
};

const handleCommand = (c: Command) => {
	vscode.postMessage({
		kind: 'webview.command',
		value: c,
	});
};

const SectionHeader = ({ open, title, commands, onHeaderClick }: Props) => {
	return (
		<div className={s.sectionHeader} onClick={onHeaderClick}>
			<span
				className={cn(
					s.icon,
					'codicon',
					open ? 'codicon-chevron-down' : 'codicon-chevron-right',
				)}
			/>
			<span className={s.title}> {title}</span>
			<div className={s.commands}>
				{(commands ?? []).map((c) => {
					return (
						<span
							key={c.command}
							className={cn(
								s.icon,
								'codicon',
								`codicon-${c.icon}`,
							)}
							onClick={(e) => {
								e.stopPropagation();
								handleCommand(c);
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default SectionHeader;