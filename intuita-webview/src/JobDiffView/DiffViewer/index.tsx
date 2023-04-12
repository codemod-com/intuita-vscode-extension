import ReactDiffViewer from 'react-diff-viewer-continued';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useWindowSize } from '../hooks/useWindowSize';

type DiffViewProps = {
	oldFileContent: string | null;
	newFileContent: string | null;
	oldFileTitle: string;
	newFileTitle: string;
};

export const JobDiffView = ({
	oldFileContent,
	newFileContent,
	oldFileTitle,
	newFileTitle,
}: DiffViewProps) => {
	const { width } = useWindowSize();

	const renderContent = (value: string) => {
		return (
			<SyntaxHighlighter
				customStyle={{
					backgroundColor: 'transparent',
					padding: '0px',
					margin: '0px',
					fontSize: 'var(--vscode-editor-font-size)',
					fontFamily: 'var(--vscode-editor-font-family)',
				}}
				language="javascript"
			>
				{value}
			</SyntaxHighlighter>
		);
	};

	return (
		<div
			style={{
				backgroundColor: 'white',
				width: '100%',
				maxWidth: '100%',
				fontFamily: 'var(--vscode-editor-font-family)',
			}}
		>
			<ReactDiffViewer
				styles={{
					diffContainer: {
						overflowX: 'auto',
						display: 'block',
						'& pre': { whiteSpace: 'pre' },
					},
					line: {
						wordBreak: 'break-word',
					},
					titleBlock: {
						display: 'block',
						whiteSpace: 'pre',
						width: (width ?? 0) / 2,
					},
					gutter: {
						width: 40,
					},
					lineNumber: {
						width: 40,
					},
					content: {
						width: (width ?? 0) / 2 - 80,
						overflowX: 'auto',
						display: 'block',
						'& pre': { whiteSpace: 'pre' },
					},
				}}
				showDiffOnly={true}
				renderContent={renderContent}
				oldValue={oldFileContent ?? ''}
				codeFoldMessageRenderer={(total) => (
					<p> {`Show Collapsed ${total} lines  `} </p>
				)}
				leftTitle={oldFileTitle}
				rightTitle={newFileTitle}
				newValue={newFileContent ?? ''}
				splitView={true}
			/>
		</div>
	);
};
