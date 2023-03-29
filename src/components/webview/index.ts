import  type { ExtensionContext, window, commands } from "vscode"
import { SourceControlService } from "./sourceControl";
import { IntuitaPanel } from "./IntuitaPanel";

export const initWebview = (w: typeof window , c: typeof commands,  context: ExtensionContext) => {
  const intuitaWebviewProvider =  new IntuitaPanel(context);
	const view = w.registerWebviewViewProvider(
		'intuita-webview',
		intuitaWebviewProvider,
	);

  context.subscriptions.push(view);

	const sourceControl = new SourceControlService();

	context.subscriptions.push(c.registerCommand('intuita.sourceControl.submitIssue', () => {
		sourceControl.createIssue();
	}))
}