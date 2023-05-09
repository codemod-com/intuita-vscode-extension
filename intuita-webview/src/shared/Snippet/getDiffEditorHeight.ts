import type { editor } from 'monaco-editor';

export const getDiffEditorHeight = (editor: editor.IStandaloneDiffEditor) => {
	const originalEditor = editor.getOriginalEditor();
	const modifiedEditor = editor.getModifiedEditor();

	if (!originalEditor || !modifiedEditor) {
		return;
	}

	const originalEditorHeight = originalEditor.getContentHeight();
	const modifiedEditorHeight = modifiedEditor.getContentHeight();

	return Math.max(originalEditorHeight, modifiedEditorHeight);
};
