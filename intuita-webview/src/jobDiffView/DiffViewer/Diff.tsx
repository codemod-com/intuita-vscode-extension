import { useRef, useState } from 'react';
import MonacoDiffEditor, { monaco } from '../../shared/Snippet/DiffEditor';
import { JobDiffViewProps } from '../App';
import { getDiff, Diff } from '../../shared/Snippet/calculateDiff';
import { getDiffEditorHeight } from '../../shared/Snippet/getDiffEditorHeight';

export type { Diff };

export const useDiffViewer = ({
	oldFileContent,
	newFileContent,
	viewType,
}: JobDiffViewProps & { viewType: 'inline' | 'side-by-side' }) => {
	const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
	const [diff, setDiff] = useState<Diff | null>(null);
	const [height, setHeight] = useState<number | null>(null);

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

	const getHeight = () => {
		if (!editorRef.current) {
			return;
		}

		setHeight(getDiffEditorHeight(editorRef.current) ?? null);
	};

	const handleRefSet = () => {
		const diffChanges = getDiffChanges();
		setDiff(diffChanges ?? null);
		getHeight();
	};

	const getDiffViewer = (
		<div className="w-full">
			<MonacoDiffEditor
				height={height ?? '90vh'}
				onRefSet={handleRefSet}
				ref={editorRef}
				options={{
					readOnly: true,
					renderSideBySide: viewType === 'side-by-side',
					wrappingStrategy: 'advanced',
					wordWrap: 'wordWrapColumn',
					scrollBeyondLastLine: false,
					diffAlgorithm: 'smart',
					scrollbar: {
						horizontal: 'hidden',
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

	return { diffViewer: getDiffViewer, diff };
};
