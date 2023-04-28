import { useEffect, useState } from 'react';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';

type Props = {
	defaultValue: string;
	error: { value: string; timestamp: number } | null;
	onEditDone: (value: string) => void;
};
export const DirectorySelector = ({
	defaultValue,
	onEditDone,
	error,
}: Props) => {
	const [value, setValue] = useState(defaultValue);
	const [showError, setShowError] = useState(error);

	useEffect(() => {
		setShowError(error);
	}, [error]);

	const handleChange = (e: Event | React.FormEvent<HTMLElement>) => {
		setShowError(null);
		const value = (e.target as HTMLInputElement).value;
		setValue(value);
	};

	return (
		<div className="flex flex-row justify-between pb-10">
			<div className="flex flex-col w-full">
				<VSCodeTextField
					className="flex-1"
					value={value}
					onInput={handleChange}
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
