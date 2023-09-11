import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';
import './tiptap.css';

type Props = Readonly<{
	title: string;
	body: string;
}>;

const CreateIssue = (props: Props) => {
	// TODO: handle loading for creating issue
	const [loading] = useState(false);

	const [title, setTitle] = useState('');

	const onChangeTitle = (e: Event | React.FormEvent<HTMLElement>) => {
		const value =
			'target' in e && e.target !== null
				? (e.target as HTMLTextAreaElement).value
				: null;
		if (value === null) {
			return;
		}
		setTitle(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (editor === null) {
			return;
		}

		vscode.postMessage({
			kind: 'webview.sourceControl.createIssue',
			data: {
				title,
				body: editor.getHTML(),
			},
		});
	};

	const extensions = [StarterKit];

	const editor = useEditor({
		extensions,
		content: props.body,
		editable: true,
	});

	useEffect(() => {
		setTitle(props.title);
	}, [props.title]);

	useEffect(() => {
		if (editor === null) {
			return;
		}
		editor.commands.setContent(props.body, false);
	}, [editor, props.body]);

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>Report codemod issue</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<VSCodeTextField
					placeholder="Title"
					value={title}
					onInput={onChangeTitle}
					className={styles.title}
				>
					Title
				</VSCodeTextField>
				<label className={styles.label}>Description</label>
				<EditorContent editor={editor} />

				<div className={styles.actions}>
					<VSCodeButton
						disabled={
							loading ||
							title.length <= 3 ||
							(editor?.getText() || '').length <= 5
						}
						type="submit"
						className={styles.actionButton}
					>
						{loading ? 'Submitting...' : 'Create Issue'}
					</VSCodeButton>
				</div>
			</form>
		</div>
	);
};

export default CreateIssue;
