import { forwardRef } from 'react';
import { DiffEditorProps, DiffEditor } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

type DiffViewerProps = DiffEditorProps & {
	onRefSet: (editor: editor.IStandaloneDiffEditor) => void;
};
const DiffViewer = forwardRef<editor.IStandaloneDiffEditor, DiffViewerProps>(
	({ onRefSet, ...props }, ref) => {
		return (
			<div className="relative w-full h-full">
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
			</div>
		);
	},
);

export default DiffViewer;
