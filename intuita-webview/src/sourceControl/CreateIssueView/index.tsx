import {
	VSCodeButton,
	VSCodeTextArea,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';

type Props = Readonly<{
	loading: boolean;
	initialFormData: Partial<{
		title: string;
		description: string;
	}>;
}>;

const CreateIssue = ({ loading, initialFormData }: Props) => {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	const { title: initialTitle } = initialFormData;

	useEffect(() => {
		if (initialTitle) {
			setTitle(initialTitle);
		}
	}, [initialTitle]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.createIssue.submitIssue',
			value: {
				title,
				body,
			},
		});
	};

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>Create an Issue</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<VSCodeTextField
					placeholder="title"
					value={title}
					onInput={(e) =>
						setTitle((e.target as HTMLInputElement).value)
					}
				>
					Title
				</VSCodeTextField>
				<VSCodeTextArea
					placeholder="Description"
					value={body}
					onInput={(e) =>
						setBody((e.target as HTMLInputElement).value)
					}
				>
					Description
				</VSCodeTextArea>
				<VSCodeButton type="submit" className={styles.submitButton}>
					{loading ? 'Submitting...' : 'Create Issue'}
				</VSCodeButton>
			</form>
		</div>
	);
};

export default CreateIssue;
