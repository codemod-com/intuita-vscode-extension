import MonacoDiffEditor from '../../shared/Snippet/DiffEditor';
import { JobDiffViewProps } from '../App';

export const DiffViewer = ({
	oldFileContent,
	newFileContent,
	viewType,
}: JobDiffViewProps & { viewType: 'inline' | 'side-by-side' }) => {
	return (
		<div className="w-full">
			<MonacoDiffEditor
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
};
