import { forwardRef } from 'react';
import { DiffEditorProps, DiffEditor } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

type DiffViewerProps = DiffEditorProps & {
	onRefSet: (editor: editor.IStandaloneDiffEditor) => void;
};
const DiffViewer = forwardRef<editor.IStandaloneDiffEditor, DiffViewerProps>(
	({ onRefSet, ...props }, ref) => {
		return (
			<DiffEditor
				onMount={(editor) => {
					typeof ref === 'function' && ref(editor);
					if (!(typeof ref === 'function') && ref) {
						ref.current = editor;
					}
					onRefSet(editor);
				}}
				{...props}
			/>
		);
	},
);

export default DiffViewer;
