import { VSCodeButton, VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { vscode } from '../shared/utilities/vscode';

export const BuildItYourSelf = () => {
	return (
		<div className="welcomeMessage">
			<p>
				Create a codemod on
				<VSCodeLink href="https://codemod.studio">
					Codemod Studio
				</VSCodeLink>
				and import it here.
			</p>
			<VSCodeButton
				className="w-full"
				onClick={(e) => {
					e.stopPropagation();
					vscode.postMessage({
						kind: 'webview.command',
						value: {
							command: 'openLink',
							arguments: ['https://codemod.studio'],
							title: 'Open Codemod Studio',
						},
					});
				}}
			>
				Open Codemod Studio
			</VSCodeButton>
		</div>
	);
};
