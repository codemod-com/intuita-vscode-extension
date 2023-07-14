import { memo, useEffect, useRef } from 'react';
import { getDiff, Diff } from '../../shared/Snippet/calculateDiff';
import type { editor } from 'monaco-editor';
import { Disposable } from 'vscode';
import configure from './configure';
import { DiffEditor, Monaco } from '@monaco-editor/react';

export type { Diff };

type Props = Readonly<{
	jobHash: string;
	oldFileContent: string | null;
	newFileContent: string | null;
	viewType: 'inline' | 'side-by-side';
	theme: string;
	onDiffCalculated: (diff: Diff) => void;
	onChange(content: string): void;
}>;

const getDiffChanges = (
	editor: editor.IStandaloneDiffEditor,
): Diff | undefined => {
	const lineChanges = editor.getLineChanges();

	if (!lineChanges) {
		return;
	}
	return getDiff(lineChanges);
};

export const DiffComponent = memo(
	({
		oldFileContent,
		newFileContent,
		viewType,
		onDiffCalculated,
		onChange,
		theme,
		jobHash,
	}: Props) => {
		const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
		const handlerRef = useRef<Disposable | null>(null);
		const jobHashRef = useRef<string | null>(null);

		useEffect(() => {
			editorRef.current?.getModifiedEditor().setScrollTop(0);
		}, [oldFileContent, newFileContent]);

		const reattachHandler = (editor?: editor.IStandaloneDiffEditor) => {
			if (jobHashRef.current === jobHash) {
				return;
			}

			const modifiedEditor =
				(editor ?? editorRef.current)?.getModifiedEditor() ?? null;

			if (modifiedEditor === null) {
				return;
			}

			if (handlerRef.current !== null) {
				handlerRef.current.dispose();
			}

			handlerRef.current = modifiedEditor.onDidChangeModelContent(() => {
				const content = modifiedEditor.getModel()?.getValue() ?? null;
				if (content === null) {
					return;
				}

				onChange(content);
			});

			jobHashRef.current = jobHash;
		};

		reattachHandler();

		return (
			<DiffEditor
				theme={theme}
				onMount={(e: editor.IStandaloneDiffEditor, m: Monaco) => {
					editorRef.current = e;

					e.onDidUpdateDiff(() => {
						const diffChanges = getDiffChanges(e);

						if (diffChanges) {
							onDiffCalculated(diffChanges);
						}
						reattachHandler(e);
					});
					configure(e, m);
				}}
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
				modifiedModelPath="modified.tsx"
				originalModelPath="original.tsx"
				language="typescript"
			/>
		);
	},
);
