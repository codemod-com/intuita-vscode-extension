import React, {
	KeyboardEvent,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import { CodemodHash } from '../../shared/types';
import IntuitaPopover from '../../shared/IntuitaPopover';
import classNames from 'classnames';

const updatePath = (
	value: string,
	errorMessage: string | null,
	warningMessage: string | null,
	revertToPrevExecutionIfInvalid: boolean,
	rootPath: string,
	codemodHash: CodemodHash,
) => {
	const repoName = rootPath.split('/').slice(-1)[0] ?? '';
	vscode.postMessage({
		kind: 'webview.codemodList.updatePathToExecute',
		value: {
			newPath: value.replace(repoName, rootPath),
			codemodHash,
			errorMessage,
			warningMessage,
			revertToPrevExecutionIfInvalid,
		},
	});
};

type Props = {
	defaultValue: string;
	displayValue: string | ReactNode | null;
	rootPath: string;
	codemodHash: CodemodHash;
	error: { message: string } | null;
	autocompleteItems: ReadonlyArray<string>;
	onEditStart(): void;
	onEditEnd(): void;
	onEditCancel(): void;
	onChange(value: string): void;
};

export const DirectorySelector = ({
	defaultValue,
	displayValue: displayValueProp,
	rootPath,
	codemodHash,
	onEditStart,
	onEditEnd,
	onEditCancel,
	onChange,
	error,
	autocompleteItems,
}: Props) => {
	const displayValue = displayValueProp || defaultValue;
	const repoName =
		rootPath
			.split('/')
			.filter((part) => part.length !== 0)
			.slice(-1)[0] ?? '';
	const [value, setValue] = useState(defaultValue);
	const [showErrorStyle, setShowErrorStyle] = useState(false);
	const [editing, setEditing] = useState(false);
	const ignoreBlurEvent = useRef(false);
	const [autocompleteIndex, setAutocompleteIndex] = useState(0);
	const hintRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!editing) {
			return;
		}

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
	}, [editing]);

	useEffect(() => {
		setAutocompleteIndex(0);
	}, [autocompleteItems]);

	const autocompleteContent = autocompleteItems[autocompleteIndex]?.replace(
		rootPath,
		repoName,
	);

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		ignoreBlurEvent.current = false;
		const newValue = (e.target as HTMLInputElement).value.trim();
		// path must start with repo name + slash
		// e.g., "cal.com/"
		const validString = !newValue.startsWith(`${repoName}/`)
			? `${repoName}/`
			: newValue;
		setValue(validString);
		onChange(validString.replace(repoName, rootPath));
	};

	const handleCancel = () => {
		updatePath(defaultValue, null, null, false, rootPath, codemodHash);
		onEditCancel();
		setEditing(false);
		setValue(defaultValue);

		if (value !== defaultValue) {
			vscode.postMessage({
				kind: 'webview.global.showWarningMessage',
				value: 'Change Reverted.',
			});
		}
	};

	const handleBlur = () => {
		if (ignoreBlurEvent.current) {
			return;
		}
		updatePath(
			value,
			null,
			value === defaultValue ? null : 'Change Reverted.',
			true,
			rootPath,
			codemodHash,
		);
		onEditCancel();
		setEditing(false);
		setValue(defaultValue);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			ignoreBlurEvent.current = true;
			handleCancel();
		}

		if (event.key === 'Enter') {
			ignoreBlurEvent.current = true;
			if (value === defaultValue) {
				handleCancel();
				return;
			}

			updatePath(
				value,
				'The specified execution path does not exist.',
				null,
				false,
				rootPath,
				codemodHash,
			);
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
		ignoreBlurEvent.current = false;
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
						onBlur={handleBlur}
						onClick={(e) => {
							e.stopPropagation();
						}}
					/>
				</div>
			</div>
		);
	}

	return (
		<IntuitaPopover
			children={
				<VSCodeButton
					appearance="icon"
					onDoubleClick={(event) => {
						event.stopPropagation();

						setEditing(true);
						onEditStart();
						ignoreBlurEvent.current = false;
						setValue(defaultValue);
					}}
					className={styles.targetPathButton}
				>
					<span className={styles.label}>
						{typeof displayValue === 'string' ? (
							displayValue === `${repoName}/` ? (
								<em>{`${repoName}/`}</em>
							) : (
								displayValue
									.split('/')
									.filter((part) => part.length !== 0)
									.slice(-1)[0]
							)
						) : (
							displayValue
						)}
					</span>
				</VSCodeButton>
			}
			content="Codemod's target path. Double-click to edit."
		/>
	);
};
