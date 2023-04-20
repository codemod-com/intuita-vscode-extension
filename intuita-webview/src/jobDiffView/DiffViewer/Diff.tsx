import { useRef, useState } from 'react';
import MonacoDiffEditor, { monaco } from '../../shared/Snippet/DiffEditor';
import { JobDiffViewProps } from '../App';
import { getDiff, Diff } from '../../shared/Snippet/calculateDiff';

export type { Diff };

export const useDiffViewer = ({
	oldFileContent,
	newFileContent,
	viewType,
}: JobDiffViewProps & { viewType: 'inline' | 'side-by-side' }) => {
	const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
	const [diff, setDiff] = useState<Diff | null>(null);

	const getDiffChanges = (): Diff | undefined => {
		if (!editorRef.current) {
			return;
		}
		const lineChanges = editorRef.current.getLineChanges();
		if (!lineChanges) {
			return;
		}
		return getDiff(lineChanges);
	};

	const handleRefSet = () => {
		const diffChanges = getDiffChanges();
		setDiff(diffChanges ?? null);
	};

	const getDiffViewer = (
		<div className="w-full">
			<MonacoDiffEditor
				onRefSet={handleRefSet}
				ref={editorRef}
				options={{
					readOnly: true,
					renderSideBySide: viewType === 'side-by-side',
					wrappingStrategy: 'advanced',
					scrollBeyondLastLine: false,
					diffAlgorithm: 'smart',
				}}
				height="90vh"
				loading={<div>Loading content ...</div>}
				modified={newFileContent ?? undefined}
				original={oldFileContent ?? undefined}
				language="typescript"
			/>
		</div>
	);

	return { diffViewer: getDiffViewer, diff };
};
