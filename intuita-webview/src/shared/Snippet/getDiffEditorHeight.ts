import * as monaco from 'monaco-editor';

export const getDiffEditorHeight = (
	editor: monaco.editor.IStandaloneDiffEditor,
) => {
	const originalEditor = editor.getOriginalEditor();
	const modifiedEditor = editor.getModifiedEditor();

	if (!originalEditor || !modifiedEditor) {
		return;
	}

	const originalEditorLineHeight = originalEditor.getOption(
		monaco.editor.EditorOption.lineHeight,
	);
	const modifiedEditorLineHeight = modifiedEditor.getOption(
		monaco.editor.EditorOption.lineHeight,
	);

	const originalEditorLineCount =
		originalEditor.getModel()?.getLineCount() || 0;
	const modifiedEditorLineCount =
		modifiedEditor.getModel()?.getLineCount() || 0;

	const originalEditorHeight =
		originalEditor.getTopForLineNumber(originalEditorLineCount + 1) +
		originalEditorLineHeight;
	const modifiedEditorHeight =
		modifiedEditor.getTopForLineNumber(modifiedEditorLineCount + 1) +
		modifiedEditorLineHeight;

	const height = Math.max(originalEditorHeight, modifiedEditorHeight);

	return height;
};
