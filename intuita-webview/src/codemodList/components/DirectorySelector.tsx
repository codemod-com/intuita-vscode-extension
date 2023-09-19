import React, {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import {
	VSCodeOption,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import { CodemodHash } from '../../shared/types';
import cn from 'classnames';

const updatePath = (
	value: string,
	rootPath: string,
	codemodHash: CodemodHash,
) => {
	const repoName = rootPath.split('/').slice(-1)[0] ?? '';
	vscode.postMessage({
		kind: 'webview.codemodList.updatePathToExecute',
		value: {
			newPath: value.replace(repoName, rootPath),
			codemodHash,
			errorMessage: '',
			warningMessage: '',
			revertToPrevExecutionIfInvalid: false,
		},
	});
};

type Props = {
	defaultValue: string;
	rootPath: string;
	codemodHash: CodemodHash;
	error: { message: string } | null;
	autocompleteItems: ReadonlyArray<string>;
	onQueryChanged(value: string): void;
};

export const DirectorySelector = ({
	defaultValue,
	rootPath,
	codemodHash,
	onQueryChanged,
	error,
	autocompleteItems,
}: Props) => {
	const repoName =
		rootPath
			.split('/')
			.filter((part) => part.length !== 0)
			.slice(-1)[0] ?? '';

	const [value, setValue] = useState(defaultValue);
	const [showErrorStyle, setShowErrorStyle] = useState(false);
	const [ignoreEnterKeyUp, setIgnoreEnterKeyUp] = useState(false);
	const ignoreBlurEvent = useRef(false);
	const [focusedOptionIdx, setFocusedOptionIdx] = useState(0);
	const [showOptions, setShowOptions] = useState(false);

	const autocompleteOptions = autocompleteItems
		.map((item) => item.replace(rootPath, repoName))
		.slice(0, 10);

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		ignoreBlurEvent.current = false;
		const newValue = (e.target as HTMLInputElement).value.trim();
		// path must start with repo name + slash
		// e.g., "cal.com/"
		const validString = !newValue.startsWith(`${repoName}/`)
			? `${repoName}/`
			: newValue;
		setValue(validString);
		onQueryChanged(validString.replace(repoName, rootPath));
	};

	const handleCancel = () => {
		updatePath(defaultValue, rootPath, codemodHash);
		setValue(defaultValue);

		if (value !== defaultValue) {
			vscode.postMessage({
				kind: 'webview.global.showWarningMessage',
				value: 'Change Reverted.',
			});
		}
	};

	const handleFocus = () => {
		setShowOptions(true);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			ignoreBlurEvent.current = true;
			handleCancel();
		}

		if (event.key === 'Enter' && !ignoreEnterKeyUp) {
			ignoreBlurEvent.current = true;
			if (value === defaultValue) {
				handleCancel();
				return;
			}

			updatePath(value, rootPath, codemodHash);
		}
		setIgnoreEnterKeyUp(false);
	};

	useEffect(() => {
		ignoreBlurEvent.current = false;
		setShowErrorStyle(error !== null);
	}, [error]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const maxLength = autocompleteOptions.length;

		if(e.key === 'Esc') {
			setFocusedOptionIdx(0);
			setShowOptions(false);	
		}
		
		if (e.key === 'Enter') {
			const nextValue = autocompleteItems[focusedOptionIdx] ?? '';
			updatePath(nextValue, rootPath, codemodHash);
		}

		if (e.key === 'ArrowUp') {
			setFocusedOptionIdx((focusedOptionIdx - 1 + maxLength) % maxLength);
			e.stopPropagation();
			e.preventDefault();
		}

		if (e.key === 'ArrowDown') {
			setFocusedOptionIdx((focusedOptionIdx + 1) % maxLength);
			e.stopPropagation();
			e.preventDefault();
		}

		if (e.key === 'Tab') {
			setFocusedOptionIdx((focusedOptionIdx + 1) % maxLength);
			e.stopPropagation();
			e.preventDefault();
		}
	};

	console.log(focusedOptionIdx, '?');
	useLayoutEffect(() => {
		document.getElementById(`option_${focusedOptionIdx}`)?.focus();
	}, [focusedOptionIdx]);

	return (
		<div
			className="flex flex-row justify-between align-items-center"
			style={{
				width: '100%',
			}}
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			<div
				className="flex flex-col w-full overflow-hidden relative"
				tabIndex={0}
			>
				<VSCodeTextField
					id="directory-selector"
					className={cn(
						styles.textField,
						showErrorStyle && styles.textFieldError,
					)}
					value={value}
					onInput={handleChange}
					onKeyUp={handleKeyUp}
					onFocus={handleFocus}
				>
					Target path
				</VSCodeTextField>
				<div className={styles.autocompleteItems}>
					{showOptions &&
						autocompleteOptions.map((item, i) => (
							<VSCodeOption
								tabIndex={0}
								id={`option_${i}`}
								className={styles.option}
								onClick={() => {
									updatePath(item, rootPath, codemodHash);
								}}
							>
								{item}
							</VSCodeOption>
						))}
				</div>
			</div>
		</div>
	);
};
