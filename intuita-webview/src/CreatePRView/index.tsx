import {
	VSCodeButton,
	VSCodeTextArea,
	VSCodeTextField,
	VSCodeDropdown,
	VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import { useState } from 'react';
import styles from './style.module.css';

type Props = {
	loading: boolean;
};

type FormData = {
	baseBranch: string;
	targetBranch: string;
	title: string;
	body: string;
};

const initialFormData: FormData = {
	baseBranch: 'main',
	targetBranch: '',
	title: '',
	body: '',
};

const CreatePR = ({ loading }: Props) => {
	const [formData, setFormData] = useState<FormData>(initialFormData);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// vscode.postMessage({
		// 	command: 'intuita.sourceControl.createPR',
		// 	value: formData,
		// });
	};

	const { title, body, baseBranch, targetBranch } = formData;

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>Create Pull Request</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<VSCodeDropdown
					value={baseBranch}
					onChange={(e) => {
						setFormData({
							...formData,
							baseBranch: (e.target as HTMLSelectElement).value,
						});
					}}
				>
					<VSCodeOption value="main"> Main </VSCodeOption>
				</VSCodeDropdown>
				<VSCodeDropdown
					value={targetBranch}
					onChange={(e) => {
						setFormData({
							...formData,
							baseBranch: (e.target as HTMLSelectElement).value,
						});
					}}
				>
					<VSCodeOption value="target"> Target </VSCodeOption>
				</VSCodeDropdown>
				<VSCodeTextField
					placeholder="title"
					value={title}
					onInput={(e) =>
						setFormData({
							...formData,
							title: (e.target as HTMLInputElement).value,
						})
					}
				>
					Title
				</VSCodeTextField>
				<VSCodeTextArea
					placeholder="Description"
					value={body}
					onInput={(e) =>
						setFormData({
							...formData,
							body: (e.target as HTMLInputElement).value,
						})
					}
				>
					Body
				</VSCodeTextArea>
				<VSCodeButton type="submit" className={styles.submitButton}>
					{loading ? 'Submitting...' : 'Create Pull Request'}
				</VSCodeButton>
			</form>
		</div>
	);
};

export default CreatePR;
