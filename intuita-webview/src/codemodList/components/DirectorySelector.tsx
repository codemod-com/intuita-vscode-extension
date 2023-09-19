import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
	VSCodeOption,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import { CodemodHash } from '../../shared/types';
import cn from 'classnames';

const updatePath = (value: string, codemodHash: CodemodHash) => {
	vscode.postMessage({
		kind: 'webview.codemodList.updatePathToExecute',
		value: {
			newPath: value,
			codemodHash,
			errorMessage: '',
			warningMessage: '',
			revertToPrevExecutionIfInvalid: false,
		},
	});
};

type Props = {
	defaultValue: string;
	codemodHash: CodemodHash;
	autocompleteItems: ReadonlyArray<string>;
};

export const DirectorySelector = ({
	defaultValue,
	codemodHash,
	autocompleteItems,
}: Props) => {
	const [value, setValue] = useState(defaultValue);
	const [focusedOptionIdx, setFocusedOptionIdx] = useState(0);
	const [showOptions, setShowOptions] = useState(false);

	console.log(defaultValue, '?')
	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	const autocompleteOptions = autocompleteItems
		.filter((i) =>
			i.toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()),
		)
		.slice(0, 5);

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		setValue((e.target as HTMLInputElement)?.value);
	};

	const handleFocus = () => {
		setShowOptions(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const maxLength = autocompleteOptions.length;

		if (e.key === 'Esc') {
			setFocusedOptionIdx(0);
			setShowOptions(false);
		}

		if (e.key === 'Enter') {
			const nextValue = autocompleteOptions[focusedOptionIdx] ?? '';
			setShowOptions(false);
			setValue(nextValue);
			updatePath(nextValue, codemodHash);
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
					className={cn(styles.textField)}
					value={value}
					onInput={handleChange}
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
									console.log(item)
									setShowOptions(false);
									setValue(item);
									updatePath(item, codemodHash);
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
