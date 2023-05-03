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
}: Omit<JobDiffViewProps, 'staged'> & {
	viewType: 'inline' | 'side-by-side';
}) => {
	const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
	const [diff, setDiff] = useState<Diff | null>(null);
	const [height, setHeight] = useState<string>('90vh');

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
		const editorHeight = getDiffEditorHeight(editorRef.current);
		if (editorHeight) {
			setHeight(`${editorHeight}px`);
		}
	};

	const handleRefSet = () => {
		const diffChanges = getDiffChanges();
		setDiff(diffChanges ?? null);
		getHeight();
	};

	const getDiffViewer = (
		<div
			className="w-full"
			style={{
				height: height,
			}}
		>
			<MonacoDiffEditor
				height={height}
				width={'100%'}
				onRefSet={handleRefSet}
				ref={editorRef}
				options={{
					readOnly: true,
					renderSideBySide: viewType === 'side-by-side',
					wrappingStrategy: 'advanced',
					wordWrap: 'wordWrapColumn',
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

	return { diffViewer: getDiffViewer, diff };
};
