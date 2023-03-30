import {
	VSCodeButton,
	VSCodeTextArea,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import { useState } from 'react';
import { vscode } from '../utilities/vscode';
import styles from './style.module.css';

type Props = {
	loading: boolean;
};

const CreateIssue = ({ loading }: Props) => {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			command: 'intuita.sourceControl.submitIssue',
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
