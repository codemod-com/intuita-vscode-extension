import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../../../shared/Popover';
import { vscode } from '../../../../shared/utilities/vscode';
import { CSSProperties } from 'react';

const POPOVER_TEXTS = {
	showExtensionSettings:
		'Use hooks to perform actions (e.g formatting) on specific stages of codemod execution',
};

const HooksCTA = ({ style }: { style?: CSSProperties }) => {
	const handleShowExtensionSettings = () => {
		vscode.postMessage({
			kind: 'webview.global.openConfiguration',
		});
	};

	return (
		<Popover
			offsetY={10}
			trigger={
				<VSCodeButton
					style={style}
					appearance="secondary"
					onClick={handleShowExtensionSettings}
				>
					Try Intuita Hooks
				</VSCodeButton>
			}
			popoverText={POPOVER_TEXTS.showExtensionSettings}
		/>
	);
};

export default HooksCTA;
