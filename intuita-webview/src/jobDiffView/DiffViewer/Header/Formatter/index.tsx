import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../../../shared/Popover';
import { vscode } from '../../../../shared/utilities/vscode';

const POPOVER_TEXTS = {
	showExtensionSettings:
		'Use hooks to perform actions (e.g formatting) on specific stages of codemod execution',
	formatChanges: '',
};

const HooksCTA = () => {
	const hasFormatterCommand = false;

	const handleShowExtensionSettings = () => {
		vscode.postMessage({
			kind: 'webview.global.openConfiguration',
		});
	};

	return (
		<>
			{!hasFormatterCommand ? (
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
			) : null}
		</>
	);
};

export default HooksCTA;
