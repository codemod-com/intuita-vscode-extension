import { createRef, memo } from 'react';
import MonacoDiffEditor from '../../shared/Snippet/DiffEditor';
import { getDiff, Diff } from '../../shared/Snippet/calculateDiff';
import { getDiffEditorHeight } from '../../shared/Snippet/getDiffEditorHeight';
import type { editor } from 'monaco-editor';

export type { Diff };

export const DiffComponent = memo(
	({
		oldFileContent,
		newFileContent,
		viewType,
		onDiffCalculated,
		height,
		onHeightSet,
		theme,
	}: {
		oldFileContent: string | null;
		newFileContent: string | null;
		viewType: 'inline' | 'side-by-side';
		onDiffCalculated: (diff: Diff) => void;
		height: number;
		onHeightSet: (height: number) => void;
		theme: string;
	}) => {
		const editorRef = createRef<editor.IStandaloneDiffEditor>();

		const getDiffChanges = (
			editor: editor.IStandaloneDiffEditor,
		): Diff | undefined => {
			const lineChanges = editor.getLineChanges();
			if (!lineChanges) {
				return;
			}
			return getDiff(lineChanges);
		};

		const getHeight = () => {
			if (!editorRef.current) {
				return;
			}
			const editorHeight = getDiffEditorHeight(editorRef.current);
			if (editorHeight) {
				onHeightSet(editorHeight);
			}
		};

		const handleRefSet = (editor: editor.IStandaloneDiffEditor) => {
			editor.onDidUpdateDiff(() => {
				const diffChanges = getDiffChanges(editor);
				if (diffChanges) {
					onDiffCalculated(diffChanges);
				}
			});

			getHeight();
		};

		return (
			<div
				className="w-full"
				style={{
					height,
				}}
			>
				<MonacoDiffEditor
					height={`${height}px`}
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
			</div>
		);
	},
);
