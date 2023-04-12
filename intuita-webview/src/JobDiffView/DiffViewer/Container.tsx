import {
	VSCodeDropdown,
	VSCodeOption,
	VSCodeCheckbox,
} from '@vscode/webview-ui-toolkit/react';

const DiffHeader = () => {
	return (
		<div className='flex flex-row justify-between' >
			<VSCodeDropdown>
				<VSCodeOption>Option 1</VSCodeOption>
				<VSCodeOption>Option 2</VSCodeOption>
			</VSCodeDropdown>

			<VSCodeCheckbox checked={true} onChange={() => {}} />
		</div>
	);
};
