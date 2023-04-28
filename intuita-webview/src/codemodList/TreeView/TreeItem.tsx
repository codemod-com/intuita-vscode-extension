import { ReactNode } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import Popup from 'reactjs-popup';
import { CodemodTreeNode } from '../../shared/types';

type Props = {
	id: string;
	label: string;
	description: string;
	hoverDescription?: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	actionButtons: ReactNode[];
	hasChildren: boolean;
	kind: CodemodTreeNode['kind'];
	onClick(): void;
	depth: number;
	disabled: boolean;
};

const TreeItem = ({
	id,
	label,
	description,
	hoverDescription,
	kind,
	icon,
	open,
	focused,
	actionButtons,
	hasChildren,
	onClick,
	depth,
}: Props) => {
	return (
		<div
			id={id}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
		>
			<div
				style={{
					...(depth > 0 && {
						minWidth: `${5 + depth * 16}px`,
					}),
				}}
			/>
			{hasChildren ? (
				<div className={styles.codicon}>
					<span
						className={cn('codicon', {
							'codicon-chevron-right': !open,
							'codicon-chevron-down': open,
						})}
					/>
				</div>
			) : null}
			{kind === 'codemodItem' && description && (
				<Popup
					trigger={<div className={styles.icon}>{icon}</div>}
					position={['bottom left', 'top left']}
					on={['hover', 'focus']}
					closeOnDocumentClick
					mouseEnterDelay={300}
				>
					{description}
				</Popup>
			)}
			{kind === 'path' && <div className={styles.icon}>{icon}</div>}
			<span className={styles.label}>
				{label}
				{kind === 'codemodItem' && (
					<span className={styles.description}>
						{hoverDescription}
					</span>
				)}
			</span>
			<div className={styles.actions}>
				{actionButtons.map((el) => el)}
			</div>
		</div>
	);
};

export default TreeItem;
