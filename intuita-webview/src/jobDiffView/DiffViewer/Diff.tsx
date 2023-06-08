import { memo, useEffect, useRef } from 'react';
import MonacoDiffEditor from '../../shared/Snippet/DiffEditor';
import { getDiff, Diff } from '../../shared/Snippet/calculateDiff';
import type { editor } from 'monaco-editor';

export type { Diff };
type Props = {
	oldFileContent: string | null;
	newFileContent: string | null;
	viewType: 'inline' | 'side-by-side';
	theme: string;
	onDiffCalculated: (diff: Diff) => void;
	onChange(content: string): void;
};

export const DiffComponent = memo(
	({
		oldFileContent,
		newFileContent,
		viewType,
		onDiffCalculated,
		onChange,
		theme,
	}: Props) => {
		const editorRef = useRef<editor.IStandaloneDiffEditor>(null);
		console.log('renderDiff', newFileContent);
		useEffect(() => {
			const editorInstance =
				editorRef.current?.getModifiedEditor() ?? null;

			if (editorInstance === null) {
				return;
			}

			editorInstance.setScrollTop(0);
		}, [oldFileContent, newFileContent]);

		const getDiffChanges = (
			editor: editor.IStandaloneDiffEditor,
		): Diff | undefined => {
			const lineChanges = editor.getLineChanges();
			if (!lineChanges) {
				return;
			}
			return getDiff(lineChanges);
		};

		const handleRefSet = (editor: editor.IStandaloneDiffEditor) => {
			editor.onDidUpdateDiff(() => {
				const diffChanges = getDiffChanges(editor);
				if (diffChanges) {
					onDiffCalculated(diffChanges);
				}
			});

			const modifiedEditor = editor.getModifiedEditor();

			if (modifiedEditor === null) {
				return;
			}

			modifiedEditor.onDidChangeModelContent((e) => {
				const content = modifiedEditor.getModel()?.getValue() ?? null;

				if (content === null || content === newFileContent) {
					return;
				}

				onChange(content);
			});
		};

		return (
			<MonacoDiffEditor
				onRefSet={handleRefSet}
				theme={theme}
				ref={editorRef}
				options={{
					readOnly: false,
					originalEditable: false,
					renderSideBySide: viewType === 'side-by-side',
					wrappingStrategy: 'advanced',
					wordWrap: 'wordWrapColumn',
					wordWrapColumn: 75,
					wrappingIndent: 'indent',
					scrollBeyondLastLine: false,
					wordBreak: 'normal',
					diffAlgorithm: 'smart',
					scrollBeyondLastColumn: 0,
					contextmenu: false,
					scrollbar: {
						horizontal: 'hidden',
						verticalSliderSize: 0,
						vertical: 'hidden',
						alwaysConsumeMouseWheel: false,
					},
				}}
				loading={<div>Loading content ...</div>}
				modified={newFileContent ?? undefined}
				original={oldFileContent ?? undefined}
				language="typescript"
			/>
		);
	},
);
