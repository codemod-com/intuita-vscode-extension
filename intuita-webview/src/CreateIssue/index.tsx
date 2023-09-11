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

const CreateIssue = ({ title: titleProp, body }: Props) => {
	// TODO: handle loading for creating issue
	const [loading] = useState(false);

	const [title, setTitle] = useState(titleProp);

	const onChangeTitle = (e: Event | React.FormEvent<HTMLElement>) => {
		const value = (e as React.ChangeEvent<HTMLInputElement>).target.value;
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
		content: body,
		editable: true,
	});

	useEffect(() => {
		setTitle(title);
	}, [title]);

	useEffect(() => {
		if (editor === null) {
			return;
		}
		editor.commands.setContent(body, false);
	}, [editor, body]);

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
