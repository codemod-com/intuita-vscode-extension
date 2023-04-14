import { useRef, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useElementSize } from '../hooks/useElementSize';
import { JobDiffViewProps } from '../App';
import { JobKind } from '../../shared/constants';

export const DiffViewer = ({
	jobKind,
	oldFileContent,
	newFileContent,
}: JobDiffViewProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { width: containerWidth } =
		useElementSize<HTMLDivElement>(containerRef);
	const [viewType] = useState<'inline' | 'side-by-side'>(() => {
		return [
			JobKind.copyFile,
			JobKind.moveFile,
			JobKind.deleteFile,
			JobKind.createFile,
		].includes(jobKind as unknown as JobKind)
			? 'inline'
			: 'side-by-side';
	});

	const renderContent = (value: string) => {
		return (
			<SyntaxHighlighter
				customStyle={{
					backgroundColor: 'transparent',
					padding: '0px',
					margin: '0px',
					fontSize: 'var(--vscode-editor-font-size)',
					fontFamily: 'var(--vscode-editor-font-family)',
					overflowX: 'hidden',
				}}
				useInlineStyles={true}
				wrapLongLines={true}
				wrapLines={true}
				language="javascript"
			>
				{value}
			</SyntaxHighlighter>
		);
	};

	return (
		<div className="w-full" ref={containerRef}>
			<ReactDiffViewer
				styles={{
					diffContainer: {
						overflowX: 'auto',
						display: 'block',
						width: containerWidth ?? 0,
					},
					line: {
						whiteSpace: 'normal',
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
					<p className="text-center">
						{`Expand to show ${total} lines `}
					</p>
				)}
				newValue={newFileContent ?? ''}
				splitView={viewType === 'side-by-side'}
			/>
		</div>
	);
};
