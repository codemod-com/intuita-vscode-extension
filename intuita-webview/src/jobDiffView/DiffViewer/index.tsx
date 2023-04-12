import { useRef, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useElementSize } from '../hooks/useElementSize';
import { Container } from './Container';
import { HeaderContainer } from './header';
import type { JobDiffViewProps } from '../App';
import { title } from 'process';

export const JobDiffView = ({
	//jobKind,
	oldFileContent,
	newFileContent,
	// oldFileTitle,
	// newFileTitle,
}: JobDiffViewProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { width: containerWidth } =
		useElementSize<HTMLDivElement>(containerRef);
	const [viewType, setViewType] = useState<'inline' | 'side-by-side'>(
		'side-by-side',
	);

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
				language="typescript"
			>
				{value}
			</SyntaxHighlighter>
		);
	};

	return (
		<Container viewType={viewType} onViewTypeChange={setViewType}>
			<div
				style={{
					backgroundColor: 'white',
					width: '100%',
					maxWidth: '100%',
					fontFamily: 'var(--vscode-editor-font-family)',
				}}
				ref={containerRef}
			>
				<div className="flex flex-row flex-wrap">
					<HeaderContainer title={title} />
				</div>
				<ReactDiffViewer
					styles={{
						diffContainer: {
							overflowX: 'auto',
							display: 'block',
							width: containerWidth ?? 0,
							'& pre': { whiteSpace: 'pre' },
						},
						line: {
							wordBreak: 'break-word',
						},
						gutter: {
							width: 50,
							minWidth: 50,
							padding: 0,
						},
						lineNumber: {
							width: 40,
							padding: 0,
						},
						content: {
							width:
								viewType === 'side-by-side'
									? (containerWidth ?? 0) / 2 - 90
									: containerWidth ?? 0 - 180,
							overflowX: 'auto',
							display: 'block',
							'& pre': { whiteSpace: 'pre' },
						},
					}}
					showDiffOnly={true}
					renderContent={renderContent}
					oldValue={oldFileContent ?? ''}
					codeFoldMessageRenderer={(total) => (
						<p style={{ textAlign: 'center' }}>
							{' '}
							{`Show Collapsed ${total} lines  `}{' '}
						</p>
					)}
					newValue={newFileContent ?? ''}
					splitView={viewType === 'side-by-side'}
				/>
			</div>
		</Container>
	);
};
