import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
	VSCodeButton,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';
import { IssueFormData } from '../../../src/components/webview/webviewEvents';
import './tiptap.css';

type Props = Readonly<{
	title: string;
	body: string;
}>;

const CreateIssue = ({ title, body }: Props) => {
	const [loading] = useState(false);
	const [formData, setFormData] = useState<IssueFormData>({
		title,
		body,
	});

	useEffect(() => {
		setFormData((prevData) => ({
			...prevData,
			title,
			body,
		}));
	}, [title, body]);

	const onChangeFormField =
		(fieldName: keyof IssueFormData) =>
		(e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e as React.ChangeEvent<HTMLInputElement>).target
				.value;
			setFormData((prevData) => ({
				...prevData,
				[fieldName]: value,
			}));
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.sourceControl.createIssue',
			data: formData,
		});
	};

	const extensions = [StarterKit];

	const content = formData.body;

	const editor = useEditor({
		extensions,
		content,
		editable: true,
		onUpdate: ({ editor }) => {
			setFormData((prevData) => ({
				...prevData,
				body: editor.getText(),
			}));
		},
		autofocus: 'end',
	});

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>
				Report a Github Issue to the Intuita Team
			</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<VSCodeTextField
					placeholder="Title"
					value={formData.title}
					onInput={onChangeFormField('title')}
					className={styles.title}
				>
					Title
				</VSCodeTextField>
				<label className={styles.label}>Description</label>
				<EditorContent editor={editor} />

				<div className={styles.actions}>
					<VSCodeButton
						disabled={loading}
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
