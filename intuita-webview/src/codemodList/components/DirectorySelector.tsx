import React, { useEffect, useState } from 'react';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import { CodemodHash } from '../../shared/types';
import Popover from '../../shared/Popover';

type Props = {
	defaultValue: string;
	rootPath: string;
	codemodHash: CodemodHash;
	error: { value: string; timestamp: number } | null;
	onEditStart(): void;
	onEditEnd(): void;
};
export const DirectorySelector = ({
	defaultValue,
	rootPath,
	codemodHash,
	onEditStart,
	onEditEnd,
}: Props) => {
	const [value, setValue] = useState(defaultValue);
	const [inPathEditingMode, setInPathEditingMode] = useState(false);

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
		setInPathEditingMode(false);
		setValue(defaultValue);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			handleCancel();
		}

		if (event.key === 'Enter') {
			if (value.length <= 2) {
				// "./" (default path) should always be there
				handleCancel();
				return;
			}
			onEditDone(value);
		}
	};

	useEffect(() => {
		// this is here rather than inside `onEditDone()` because otherwise
		// the old target path is displayed for a split second
		setInPathEditingMode(false);

		// this is here rather than inside `onEditDone()` because in case of invalid path,
		// edit mode is still true and the "Dry Run" button will get displayed (which we don't want)
		onEditEnd();

		// adding `onEditEnd` to dependency list causes `inPathEditingMode` to change
		// as soon as user presses the button component, hence preventing `inPathEditingMode` from being ever `true`
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValue]);

	if (inPathEditingMode) {
		return (
			<div
				className="flex flex-row justify-between ml-10 align-items-center"
				style={{ height: '22px', width: '100%' }}
			>
				<div className="flex flex-col w-full">
					<VSCodeTextField
						className={styles.textField}
						value={value}
						onInput={handleChange}
						onKeyUp={handleKeyUp}
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
						setInPathEditingMode(true);
						onEditStart();
					}}
					className={styles.targetPathButton}
				>
					{defaultValue}
				</VSCodeButton>
			}
			popoverText="Codemod's target path. Click to edit."
		/>
	);
};
