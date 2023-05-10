import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../../../shared/Popover';
import { vscode } from '../../../../shared/utilities/vscode';

const POPOVER_TEXTS = {
	showExtensionSettings:
		'Use hooks to perform actions (e.g formatting) on specific stages of codemod execution',
};

const HooksCTA = () => {
	const handleShowExtensionSettings = () => {
		vscode.postMessage({
			kind: 'webview.global.openConfiguration',
		});
	};

	return (
		<Popover
			trigger={
				<VSCodeButton
					appearance="primary"
					onClick={handleShowExtensionSettings}
				>
					Try intuita hooks
				</VSCodeButton>
			}
			popoverText={POPOVER_TEXTS.showExtensionSettings}
		/>
	);
};

export default HooksCTA;
