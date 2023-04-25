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
import ChangesList from './ChangesList';
import BranchForm from './BranchForm';
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';
import IssueForm from './IssueForm';

type Props = Readonly<{
	loading: boolean;
	initialFormData: Partial<CommitChangesFormData>;
	baseBranchOptions: string[];
	targetBranchOptions: string[];
	remoteOptions: string[];
}>;

const initialFormState: CommitChangesFormData = {
	currentBranchName: '',
	targetBranchName: '',
	issueTitle: '',
	issueBody: '',
	pullRequestTitle: '', 
	pullRequestBody: '',
	remoteUrl: '',
	commitMessage: '',
	createNewBranch: false,
	createPullRequest: false,
	createIssue: false, 
	stagedJobs: [],
};

const CreatePR = ({
	loading,
	initialFormData,
	baseBranchOptions,
	targetBranchOptions,
	remoteOptions,
}: Props) => {
	const [formData, setFormData] = useState<CommitChangesFormData>(initialFormState);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.createPR.submitPR',
			value: formData,
		});

		vscode.postMessage({
			kind: 'webview.global.closeView',
		});
	};

	const { remoteUrl, stagedJobs, createPullRequest, createNewBranch } =
		formData;

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			...initialFormData,
		}));
	}, [initialFormData]);

	const onChangeFormField =
		(fieldName: keyof CommitChangesFormData) => (e: Event | React.FormEvent<HTMLElement>) => {
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

	const handleCancel = () => {
		vscode.postMessage({
			kind: 'webview.global.closeView',
		});
	};

	const hasMultipleRemotes = remoteOptions.length > 1;
	const hasStatedChanges = stagedJobs.length !== 0;

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
				{/* @TODO should we even allow to unapply all jobs? */}
				{hasStatedChanges ? (
					<ChangesList
						formData={formData}
						setFormData={setFormData}
					/>
				) : (
					'No changes to commit'
				)}
				<div className={styles.checkboxContainer}>
					<VSCodeCheckbox
						checked={formData.createNewBranch}
						onChange={onChangeFormField('createNewBranch')}
					>
						Create new branch
					</VSCodeCheckbox>
					<p>When selected, new branch will be created</p>
				</div>
				{createNewBranch ? <BranchForm formData={formData} /> : null}
				{createNewBranch ? (
					<div className={styles.checkboxContainer}>
						<VSCodeCheckbox
							checked={formData.createPullRequest}
							onChange={onChangeFormField('createPullRequest')}
						>
							Create Pull request
						</VSCodeCheckbox>
						<p>
							When selected, pull request will be automatically
							created
						</p>
					</div>
				) : null}
				{createNewBranch && createPullRequest ? (
					<PullRequestForm
						formData={formData}
						onChangeFormField={onChangeFormField}
						baseBranchOptions={baseBranchOptions}
						targetBranchOptions={targetBranchOptions}
					/>
				) : null}
				{
					createPullRequest ? <IssueForm formData={formData} 				onChangeFormField={onChangeFormField}/> : null
				}
				<div className={styles.actions}>
					<VSCodeButton
						onClick={handleCancel}
						type="button"
						className={styles.actionButton}
					>
						Cancel
					</VSCodeButton>
					<VSCodeButton
						disabled={loading}
						type="submit"
						className={styles.actionButton}
					>
						{loading ? 'Committing...' : 'Commit & Push'}
					</VSCodeButton>
				</div>
			</form>
		</div>
	);
};

export default CreatePR;
