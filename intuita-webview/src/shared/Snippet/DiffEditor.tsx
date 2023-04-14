import { DiffEditorProps, DiffEditor } from '@monaco-editor/react';

const MonacoDiffEditor = (props: DiffEditorProps) => {
	return (
		<div className="relative w-full h-full">
			<DiffEditor {...props} />
		</div>
	);
};

export default MonacoDiffEditor;
