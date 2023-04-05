import {
	VSCodeButton,
	VSCodeTextArea,
	VSCodeTextField,
	VSCodeDropdown,
	VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import { vscode } from '../utilities/vscode';

type Props = {
	loading: boolean;
	initialFormData: Partial<FormData>;
};

type FormData = {
	baseBranch: string;
	targetBranch: string;
	title: string;
	body: string;
};

const initialFormState: FormData = {
	baseBranch: 'main',
	targetBranch: '',
	title: '',
	body: '',
};

const CreatePR = ({ loading, initialFormData }: Props) => {
	const [formData, setFormData] = useState<FormData>(initialFormState);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.createPR.submitPR',
			value: formData,
		});
	};

	const { title, body, baseBranch, targetBranch } = formData;

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			...initialFormData,
		}));
	}, [initialFormData]);

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>Create Pull Request</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.formField}>
					<label htmlFor="baseBranch">Base branch:</label>
					<VSCodeDropdown
						id="baseBranch"
						value={baseBranch}
						onChange={(e) => {
							setFormData({
								...formData,
								baseBranch: (e.target as HTMLSelectElement)
									.value,
							});
						}}
					>
						<VSCodeOption value="main"> Main </VSCodeOption>
					</VSCodeDropdown>
				</div>
				<div className={styles.formField}>
					<label htmlFor="targetBranch">Target branch:</label>
					<VSCodeDropdown
						id="targetBranch"
						value={targetBranch}
						onChange={(e) => {
							setFormData({
								...formData,
								targetBranch: (e.target as HTMLSelectElement)
									.value,
							});
						}}
					>
						<VSCodeOption value="target"> Target </VSCodeOption>
					</VSCodeDropdown>
				</div>
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
