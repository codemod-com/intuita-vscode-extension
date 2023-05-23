import React, { useState } from 'react';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';

type Props = {
	defaultValue: string;
	error: { value: string; timestamp: number } | null;
	onEditDone: (value: string) => void;
	onCancel: () => void;
};
export const DirectorySelector = ({
	defaultValue,
	onEditDone,
	onCancel,
}: Props) => {
	const [value, setValue] = useState(defaultValue);

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		const newValue = (e.target as HTMLInputElement).value;
		setValue(newValue);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Escape') {
			onCancel();
		}

		if (event.key === 'Enter') {
			if (value.length <= 2) {
				// "./" (default path) should always be there
				onCancel();
				return;
			}
			onEditDone(value);
		}
	};

	return (
		<div
			className="flex flex-row justify-between ml-10 align-items-center"
			style={{ height: '22px', width: '100%' }}
		>
			<div className="flex flex-col w-full">
				<VSCodeTextField
					className="flex-1"
					value={value}
					onInput={handleChange}
					onKeyUp={handleKeyUp}
				/>
			</div>
		</div>
	);
};
