import { ReactNode, useEffect, useState } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import { CodemodHash, CodemodTreeNode } from '../../shared/types';
import Popover from '../../shared/Popover';
import { DirectorySelector } from '../components/DirectorySelector';
import { vscode } from '../../shared/utilities/vscode';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import { SyntheticError } from '../../../../src/errors/types';

type Props = {
	id: CodemodHash;
	progressBar: JSX.Element | null;
	label: string;
	description: string;
	open: boolean;
	focused: boolean;
	icon: ReactNode;
	actionButtons: ReactNode[];
	hasChildren: boolean;
	kind: CodemodTreeNode['kind'];
	onClick(): void;
	depth: number;
	disabled: boolean;
	rootPath: string;
	executionPath?: T.These<SyntheticError, string>;
};

const TreeItem = ({
	id,
	label,
	progressBar,
	description,
	kind,
	icon,
	open,
	focused,
	rootPath,
	actionButtons,
	hasChildren,
	onClick,
	depth,
	executionPath,
}: Props) => {
	const [targetPath, setTargetPath] = useState('');
	const [targetPathError, setTargetPathError] = useState<{
		value: string;
		timestamp: number;
	} | null>(null);
	const [inPathEditingMode, setInPathEditingMode] = useState(false);

	const onEditDone = (value: string) => {
		setInPathEditingMode(false);
		vscode.postMessage({
			kind: 'webview.codemodList.updatePathToExecute',
			value: {
				newPath: value.replace('.', rootPath),
				codemodHash: id,
			},
		});
	};

	const onCancelEditPath = () => {
		setInPathEditingMode(false);
	};

	useEffect(() => {
		if (!executionPath) {
			return;
		}

		const error = pipe(
			executionPath,
			T.fold(
				(e) => ({
					value: e.message,
					timestamp: Date.now(),
				}),
				() => null,
				(e) => ({
					value: e.message,
					timestamp: Date.now(),
				}),
			),
		);

		setTargetPathError(error);

		if (error) {
			return;
		}

		const path = pipe(
			executionPath,
			T.fold(
				() => '',
				(p) => p,
				(_, p) => p,
			),
		);

		setTargetPath(
			path.replace(rootPath, '').length === 0
				? './'
				: path.replace(rootPath, '.'),
		);
	}, [executionPath, rootPath]);

	return (
		<div
			id={id}
			className={cn(styles.root, focused && styles.focused)}
			onClick={onClick}
		>
			<div
				style={{
					// root folder, which we hide, has depth={0}
					// framework/library folders have depth={1}
					...(depth === 1 && {
						minWidth: '0.25rem',
					}),
					...(depth > 1 && {
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
				<Popover
					trigger={<div className={styles.icon}>{icon}</div>}
					position={['bottom left', 'top left']}
					mouseEnterDelay={300}
					popoverText={description}
				/>
			)}
			{(kind === 'path' || !description) && (
				<div className={styles.icon}>{icon}</div>
			)}
			<div className="flex w-full flex-col">
				<span className={styles.label}>
					{label}
					{kind === 'codemodItem' &&
						executionPath &&
						(inPathEditingMode ? (
							<DirectorySelector
								defaultValue={targetPath}
								onEditDone={onEditDone}
								error={targetPathError}
								onCancel={onCancelEditPath}
							/>
						) : (
							<Popover
								trigger={
									<VSCodeButton
										appearance="icon"
										onClick={(e) => {
											e.stopPropagation();
											setInPathEditingMode(true);
										}}
										className={styles.targetPathButton}
									>
										<i
											className="codicon codicon-pencil mr-2"
											style={{ alignSelf: 'center' }}
										/>
										{targetPath}
									</VSCodeButton>
								}
								popoverText="Codemod's target path. Click to edit."
							/>
						))}
				</span>
				{progressBar}
			</div>
			<div className={styles.actions}>
				{actionButtons.map((el) => el)}
			</div>
		</div>
	);
};

export default TreeItem;
