import { ReactNode } from 'react';
import styles from './style.module.css';
import cn from 'classnames';

type Props = {
	id: string;
	label: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	actionButtons: ReactNode;
	hasChildren: boolean;
	kind: string;
	onClick(): void;
	depth: number;
	disabled: boolean;
	color: string;
	index: number;
	lastChild: boolean;
};

const TreeItem = ({
	id,
	label,
	icon,
	open,
	focused,
	actionButtons,
	hasChildren,
	kind,
	onClick,
	depth,
	color,
	index,
	lastChild,
}: Props) => {
	const isFolderElement = ['folderElement', 'acceptedFolderElement'].includes(
		kind,
	);
	const isCaseByFolderElement = [
		'caseByFolderElement',
		'acceptedCaseByFolderElement',
	].includes(kind);
	const isElementInFolderBreakdown = isFolderElement || isCaseByFolderElement;
	const isFirstSubfolder = index === 0 && depth > 1 && isFolderElement;

	return (
		<div
			id={id}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
		>
			{isElementInFolderBreakdown ? (
				// Folder Breakdown View
				<div
					className={styles.circleContainer}
					style={{
						...(depth > 1 && {
							marginLeft: (depth - 1) * 2 * 16,
						}),
					}}
				>
					<div
						className={cn(
							isCaseByFolderElement
								? styles.smallCircle
								: styles.bigCircle,
						)}
						style={{
							...(isFolderElement && {
								borderColor: color,
							}),
							...(isCaseByFolderElement && {
								backgroundColor: color,
							}),
						}}
					/>
					{isCaseByFolderElement && (
						<div
							className={styles.verticalLine}
							style={{
								borderColor: color,
								left: 11 + (depth - 1) * 2 * 16,
								...(lastChild && {
									height: 16,
									marginTop: -10,
								}),
							}}
						/>
					)}
					{isFirstSubfolder && (
						<div
							style={{
								left: 11 + (depth - 2) * 2 * 16,
								borderLeft: '2px solid',
								borderBottom: '2px solid',
								borderColor: color,
								borderBottomLeftRadius: '5px',
								height: 14,
								width: 23,
								position: 'absolute',
								marginTop: -10,
							}}
						/>
					)}
				</div>
			) : (
				// Case Breakdown View
				<div
					style={{
						...(depth > 0 && {
							// extra margin for job
							minWidth: `${
								5 + depth * 16 + (hasChildren ? 0 : 16)
							}px`,
						}),
					}}
				/>
			)}
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
			<div className={styles.icon}>{icon}</div>
			<span className={styles.label}>{label}</span>
			<div className={styles.actions}>{actionButtons}</div>
		</div>
	);
};

export default TreeItem;
