import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
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
	autocompleteItems: string[];
	onEditStart(): void;
	onEditEnd(): void;
	onEditCancel(): void;
	onChange(value: string): void;
};

export const DirectorySelector = ({
	defaultValue,
	rootPath,
	codemodHash,
	onEditStart,
	onEditEnd,
	onEditCancel,
	onChange,
	error,
	autocompleteItems,
}: Props) => {
	const repoName = rootPath.split('/').slice(-1)[0] ?? '';
	const [value, setValue] = useState(defaultValue);
	const [showErrorStyle, setShowErrorStyle] = useState(false);
	const [editing, setEditing] = useState(false);
	const [autocompleteIndex, setAutocompleteIndex] = useState(0);
	const hintRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const inputElement = document
			.querySelector('vscode-text-field#directory-selector')
			?.shadowRoot?.querySelector('input');

		if (!inputElement) {
			return;
		}

		const onInputScroll = (e: Event) => {
			if (hintRef.current) {
				// adjust hint position when scrolling the main input
				// @ts-ignore
				hintRef.current.scrollLeft = e.target?.scrollLeft;
			}
		};

		inputElement.addEventListener('scroll', onInputScroll);

		return () => {
			inputElement.removeEventListener('scroll', onInputScroll);
		};
	}, []);

	useEffect(() => {
		setAutocompleteIndex(0);
	}, [autocompleteItems]);

	const autocompleteContent = autocompleteItems[autocompleteIndex]?.replace(
		rootPath,
		repoName,
	);

	const onEditDone = (value: string) => {
		vscode.postMessage({
			kind: 'webview.codemodList.updatePathToExecute',
			value: {
				newPath: value.replace(repoName, rootPath),
				codemodHash,
			},
		});
	};

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		const newValue = (e.target as HTMLInputElement).value;
		if (!newValue.startsWith(repoName)) {
			setValue(`${repoName}/`);
			return;
		}
		setValue(newValue);
		onChange(newValue.replace(repoName, rootPath));
	};

	const handleCancel = () => {
		onEditDone(defaultValue);
		onEditCancel();
		setEditing(false);
		setValue(defaultValue);
		setShowErrorStyle(false);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			handleCancel();
		}

		if (event.key === 'Enter') {
			if (!value.startsWith(repoName)) {
				// path must start with repo name
				handleCancel();
				return;
			}
			if (value === defaultValue) {
				handleCancel();
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

	const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
		if (e.key !== 'Tab') {
			return;
		}

		let nextAutocompleteIndex = autocompleteIndex;
		const completed =
			autocompleteItems[nextAutocompleteIndex]?.replace(
				rootPath,
				repoName,
			) === value;

		if (completed) {
			nextAutocompleteIndex =
				(autocompleteIndex + 1) % autocompleteItems.length;
		}

		setValue(
			(prevValue) =>
				autocompleteItems[nextAutocompleteIndex]?.replace(
					rootPath,
					repoName,
				) ?? prevValue,
		);
		setAutocompleteIndex(nextAutocompleteIndex);
		e.preventDefault();
	};

	if (editing) {
		return (
			<div
				className="flex flex-row justify-between ml-10 align-items-center"
				style={{
					width: '100%',
				}}
			>
				<div className="flex flex-col w-full overflow-hidden input-background relative">
					{autocompleteContent ? (
						<input
							ref={hintRef}
							className="autocomplete"
							aria-hidden={true}
							readOnly
							value={autocompleteContent}
						/>
					) : null}
					<VSCodeTextField
						id="directory-selector"
						className={classNames(
							styles.textField,
							showErrorStyle && styles.textFieldError,
						)}
						value={value}
						onInput={handleChange}
						onKeyUp={handleKeyUp}
						onKeyDown={handleKeyDown}
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
					<span className={styles.label}>
						<em>{repoName}</em>
						{defaultValue.replace(repoName, '')}
					</span>
				</VSCodeButton>
			}
			popoverText="Codemod's target path. Click to edit."
		/>
	);
};
