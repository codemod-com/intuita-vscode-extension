import { useEffect, useState } from 'react';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import { KeyboardEvent } from 'react';

const removeInputBackground = () => {
	document
		.querySelector('vscode-text-field#directory-selector')
		?.shadowRoot?.querySelector('.root')
		?.setAttribute('style', 'background: none');
};

type Props = {
	defaultValue: string;
	error: { value: string; timestamp: number } | null;
	autocompleteItems: string[];
	onEditDone: (value: string) => void;
	onChange: (value: string) => void;
};
export const DirectorySelector = ({
	defaultValue,
	onEditDone,
	onChange,
	error,
	autocompleteItems,
}: Props) => {
	const [value, setValue] = useState(defaultValue);
	const [showError, setShowError] = useState(error);
	const [autocompleteIndex, setAutocompleteIndex] = useState<number>(0);

	removeInputBackground();

	useEffect(() => {
		setAutocompleteIndex(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autocompleteItems.join()]);

	const autocompleteContent = autocompleteItems[autocompleteIndex];

	useEffect(() => {
		setShowError(error);
	}, [error]);

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		setShowError(null);
		const value = (e.target as HTMLInputElement).value;
		setValue(value);
		onChange(value);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
		if (e.key !== 'Tab') {
			return;
		}

		let nextAutocompleteIndex = autocompleteIndex;

		if (autocompleteItems[nextAutocompleteIndex] === value) {
			nextAutocompleteIndex =
				(autocompleteIndex + 1) % autocompleteItems.length;
		}

		setValue(
			(prevValue) =>
				autocompleteItems[nextAutocompleteIndex] ?? prevValue,
		);
		setAutocompleteIndex(nextAutocompleteIndex);
		e.preventDefault();
	};

	return (
		<div className="flex flex-row justify-between pb-10">
			<div className="flex flex-col w-full overflow-hidden input-background relative">
				{autocompleteContent ? (
					<span className="autocomplete">{autocompleteContent}</span>
				) : null}
				<VSCodeTextField
					id="directory-selector"
					className="flex-1"
					value={value}
					onInput={handleChange}
					onKeyDown={handleKeyDown}
				/>
				{showError && (
					<span className="text-error">{showError.value}</span>
				)}
			</div>
			<div
				className="cursor-pointer ml-3"
				onClick={() => onEditDone(value)}
			>
				<VSCodeButton>Update</VSCodeButton>
			</div>
		</div>
	);
};
