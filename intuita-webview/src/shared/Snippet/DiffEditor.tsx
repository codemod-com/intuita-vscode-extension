import { DiffEditorProps, DiffEditor } from '@monaco-editor/react';
import { useTheme } from './useTheme';

const MonacoDiffEditor = (props: DiffEditorProps) => {
	const theme = useTheme();
	return (
		<div className="relative w-full h-full">
			<DiffEditor theme={theme} {...props} />
		</div>
	);
};

export default MonacoDiffEditor;
