import { forwardRef } from 'react';
import { DiffEditorProps, DiffEditor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useTheme } from './useTheme';

export { monaco };

type DiffViewerProps = DiffEditorProps & { onRefSet: () => void };
const DiffViewer = forwardRef<
	monaco.editor.IStandaloneDiffEditor,
	DiffViewerProps
>(({ onRefSet, ...props }, ref) => {
	const theme = useTheme();

	return (
		<div className="relative w-full h-full">
			<DiffEditor
				onMount={(editor) => {
					typeof ref === 'function' && ref(editor);
					if (!(typeof ref === 'function') && ref) {
						ref.current = editor;
					}
					onRefSet();
				}}
				theme={theme}
				{...props}
				options={{
					...props.options,
					scrollbar: {
						alwaysConsumeMouseWheel: false,
					},
				}}
			/>
		</div>
	);
});

export default DiffViewer;
