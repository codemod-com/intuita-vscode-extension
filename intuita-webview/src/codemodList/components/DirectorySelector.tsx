import React, { useEffect, useState } from 'react';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import { CodemodHash } from '../../shared/types';
import Popover from '../../shared/Popover';
import classNames from 'classnames';

type Props = {
	defaultValue: string;
	rootPath: string;
	codemodHash: CodemodHash;
	error: string | null;
	onEditStart(): void;
	onEditEnd(): void;
	onEditCancel(): void;
};
export const DirectorySelector = ({
	defaultValue,
	rootPath,
	codemodHash,
	onEditStart,
	onEditEnd,
	onEditCancel,
	error,
}: Props) => {
	const [value, setValue] = useState(defaultValue);
	const [showErrorStyle, setShowErrorStyle] = useState(false);
	const [editing, setEditing] = useState(false);

	const onEditDone = (value: string) => {
		vscode.postMessage({
			kind: 'webview.codemodList.updatePathToExecute',
			value: {
				newPath: value.replace('.', rootPath),
				codemodHash,
			},
		});
	};

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		const newValue = (e.target as HTMLInputElement).value;
		setValue(newValue);
	};

	const handleCancel = () => {
		setEditing(false);
		setValue(defaultValue);
		onEditCancel();
		setShowErrorStyle(false);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			handleCancel();
		}

		if (event.key === 'Enter') {
			if (value.length < 2) {
				// "./" (default path) should always be there
				handleCancel();
				return;
			}
			if (value === defaultValue) {
				handleCancel();
				return;
			}
			onEditDone(value);
		}
	};

	useEffect(() => {
		// this is here rather than inside `onEditDone()` because otherwise
		// the old target path is displayed for a split second
		setEditing(false);

		// this is here rather than inside `onEditDone()`. Otherwise, in case of invalid path,
		// edit mode is still true and the "Dry Run" button will get displayed (which we don't want)
		onEditEnd();
	}, [defaultValue, onEditEnd]);

	useEffect(() => {
		setShowErrorStyle(error !== null);
	}, [error]);

	if (editing) {
		return (
			<div
				className="flex flex-row justify-between ml-10 align-items-center"
				style={{
					width: '100%',
				}}
			>
				<div className="flex flex-col w-full">
					<VSCodeTextField
						className={classNames(
							styles.textField,
							showErrorStyle && styles.textFieldError,
						)}
						value={value}
						onInput={handleChange}
						onKeyUp={handleKeyUp}
						autoFocus
					/>
				</div>
			</div>
		);
	}

	return (
		<Popover
			trigger={
				<VSCodeButton
					appearance="icon"
					onClick={() => {
						setEditing(true);
						onEditStart();
					}}
					className={styles.targetPathButton}
				>
					<span className={styles.label}>{defaultValue}</span>
				</VSCodeButton>
			}
			popoverText="Codemod's target path. Click to edit."
		/>
	);
};
