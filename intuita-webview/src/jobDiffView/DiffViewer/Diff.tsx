import { memo, useEffect, useRef } from 'react';
import MonacoDiffEditor from '../../shared/Snippet/DiffEditor';
import { getDiff, Diff } from '../../shared/Snippet/calculateDiff';
import type { editor } from 'monaco-editor';

export type { Diff };

export const DiffComponent = memo(
	({
		oldFileContent,
		newFileContent,
		viewType,
		onDiffCalculated,
		theme,
	}: {
		oldFileContent: string | null;
		newFileContent: string | null;
		viewType: 'inline' | 'side-by-side';
		onDiffCalculated: (diff: Diff) => void;
		theme: string;
	}) => {
		const editorRef = useRef<editor.IStandaloneDiffEditor>(null);

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
		};

		return (
			<MonacoDiffEditor
				onRefSet={handleRefSet}
				theme={theme}
				ref={editorRef}
				options={{
					readOnly: true,
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
