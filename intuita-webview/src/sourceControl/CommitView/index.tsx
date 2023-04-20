import {
	VSCodeButton,
	VSCodeDropdown,
	VSCodeOption,
	VSCodeCheckbox,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import CommitForm from './CommitForm';
import PullRequestForm from './PullRequestForm';

type Props = {
	loading: boolean;
	initialFormData: Partial<FormData>;
	baseBranchOptions: string[];
	targetBranchOptions: string[];
	remoteOptions: string[];
};

export type FormData = {
	baseBranch: string;
	targetBranch: string;
	title: string;
	body: string;
	remoteUrl: string;
	commitMessage: string;
	createNewBranch: boolean;
	createPullRequest: boolean;
};

const initialFormState: FormData = {
	baseBranch: '',
	targetBranch: '',
	title: '',
	body: '',
	remoteUrl: '',
	commitMessage: '',
	createNewBranch: false,
	createPullRequest: false,
};

const CreatePR = ({
	loading,
	initialFormData,
	baseBranchOptions,
	targetBranchOptions,
	remoteOptions,
}: Props) => {
	const [formData, setFormData] = useState<FormData>(initialFormState);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.createPR.submitPR',
			value: formData,
		});
	};

	const { remoteUrl, createPullRequest } = formData;

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			...initialFormData,
		}));
	}, [initialFormData]);

	const onChangeFormField =
		(fieldName: string) => (e: Event | React.FormEvent<HTMLElement>) => {
			const { checked, value } = e.target as HTMLInputElement;

			const nextFormData = {
				...formData,
				[fieldName]: checked !== undefined ? checked : value,
			};

			setFormData(nextFormData);

			vscode.postMessage({
				kind: 'webview.createPR.formDataChanged',
				value: nextFormData,
			});
		};

	const hasMultipleRemotes = remoteOptions.length > 1;

	return (
		<div className={styles.root}>
			<form onSubmit={handleSubmit} className={styles.form}>
				<h1 className={styles.header}>Commit changes</h1>
				{hasMultipleRemotes ? (
					<div className={styles.formField}>
						<label htmlFor="remoteUrl">Remote:</label>
						<VSCodeDropdown
							id="remoteUrl"
							value={remoteUrl}
							onChange={onChangeFormField('remoteUrl')}
						>
							{remoteOptions.map((opt, index) => (
								<VSCodeOption value={opt} key={index}>
									{opt}
								</VSCodeOption>
							))}
						</VSCodeDropdown>
					</div>
				) : null}
				<CommitForm
					formData={formData}
					onChangeFormField={onChangeFormField}
				/>
				<VSCodeCheckbox
					checked={formData.createNewBranch}
					onChange={onChangeFormField('createNewBranch')}
				>
					Create new branch
				</VSCodeCheckbox>
				<p>When selected, new branch will be created</p>
				<VSCodeCheckbox
					checked={formData.createPullRequest}
					onChange={onChangeFormField('createPullRequest')}
				>
					{' '}
					Create Pull request
				</VSCodeCheckbox>
				<p>When selected, pull request will be automatically created</p>
				{createPullRequest ? (
					<PullRequestForm
						formData={formData}
						onChangeFormField={onChangeFormField}
						baseBranchOptions={baseBranchOptions}
						targetBranchOptions={targetBranchOptions}
					/>
				) : null}
				<VSCodeButton type="submit" className={styles.submitButton}>
					{loading ? 'Committing...' : 'Commit'}
				</VSCodeButton>
			</form>
		</div>
	);
};

export default CreatePR;
