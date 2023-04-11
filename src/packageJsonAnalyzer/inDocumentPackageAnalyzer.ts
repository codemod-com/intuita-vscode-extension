import vscode from 'vscode';
import { PackageUpgradeItem } from './types';
import { commandList, packageUpgradeList } from './constants';
import { getDependencyUpgrades } from './utils';

const textEditorDecorationType = vscode.window.createTextEditorDecorationType({
	rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
	after: {
		fontStyle: 'italic',
	},
});

export const handleActiveTextEditor = () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	const { document } = editor;

	if (!document.uri.fsPath.endsWith('package.json')) {
		return;
	}
	const selection = editor.selection;

	const uri = vscode.Uri.joinPath(document.uri, '..');
	const path = encodeURIComponent(uri.fsPath);
	const ranges: [vscode.Range, readonly PackageUpgradeItem[]][] = [];
	const packagesWithNoCodemod: [
		vscode.Range,
		{
			dependency: string;
			version: string;
		},
	][] = [];

	const parsedPackageJson = JSON.parse(document.getText());

	const dependencies = parsedPackageJson?.dependencies;

	for (let i = 0; i < document.lineCount; i++) {
		const textLine = document.lineAt(i);

		const textWithoutSpace = textLine.text.replace(/\s/g, '');
		const dependencyAndVersionExtractpattern =
			/"(.+)":"(?:(?:\*|\^|~)\s*)?(\d+\.\d+\.\d+)/;
		const dependencyMatcher = textWithoutSpace.match(
			dependencyAndVersionExtractpattern,
		);
		const dependency = dependencyMatcher?.[1];
		const version = dependencyMatcher?.[2];

		if (!dependency || !version) {
			continue;
		}
		const checkedDependencies = getDependencyUpgrades(dependency, version);
		if (checkedDependencies.length) {
			ranges.push([
				textLine.range,
				checkedDependencies.reduce((acc, curr) => {
					acc.push(curr);
					return acc;
				}, [] as PackageUpgradeItem[]),
			]);
		}
		if (
			Object.keys(dependencies).includes(dependency) &&
			(!checkedDependencies.length)
		) {
			const codmodsAvaliable = packageUpgradeList.find(
				(el) => el.packageName === dependency,
			);
			if (!textLine.range.intersection(selection) || codmodsAvaliable) {
				continue;
			}
			packagesWithNoCodemod.push([
				textLine.range,
				{
					dependency,
					version,
				},
			]);
		}
	}

	const rangesWithDependency: vscode.DecorationOptions[] =
		packagesWithNoCodemod.map(([range, { version, dependency }]) => {
			const commandUri = vscode.Uri.parse(
				'https://github.com/intuita-inc/codemod-registry/issues/new',
			);

			const hoverMessage = new vscode.MarkdownString(
				`[Request a codemod](${commandUri})`,
			);
			hoverMessage.isTrusted = true;
			hoverMessage.supportHtml = true;
			return {
				range: range.with({
					start: range.start.with({
						character: range.start.character + range.end.character,
					}),
				}),
				hoverMessage: hoverMessage,
				renderOptions: {
					after: {
						contentText: `Request codemod for ${dependency}:${version}`,
						margin: '0 0 0 1em',
						fontStyle: 'italic',
						color: new vscode.ThemeColor(
							'editorLineNumber.foreground',
						),
					},
				},
			};
		});

	const rangesOrOptions: vscode.DecorationOptions[] = ranges
		.map(([range, dependencyList]) => {
			return dependencyList.map((el) => {
				const args = {
					path,
				};

				const commandUri = vscode.Uri.parse(
					`command:${commandList[el.id]}?${encodeURIComponent(
						JSON.stringify(args),
					)}`,
				);

				const hoverMessage = new vscode.MarkdownString(
					`[Execute ${el.name}](${commandUri})`,
				);
				hoverMessage.isTrusted = true;
				hoverMessage.supportHtml = true;

				return {
					range: range.with({
						start: range.start.with({
							character:
								range.start.character + range.end.character,
						}),
					}),
					hoverMessage,
					renderOptions: {
						after: {
							color: new vscode.ThemeColor(
								'list.activeSelectionForeground',
							),
							contentText: `${el.name} ${el.kind} to ${el.latestVersionSupported}`,
							margin: '0 0 0 1em',
							fontStyle: 'italic',
						},
					},
				};
			});
		})
		.flat();

	editor.setDecorations(textEditorDecorationType, [
		...rangesOrOptions,
		...rangesWithDependency,
	]);
};
