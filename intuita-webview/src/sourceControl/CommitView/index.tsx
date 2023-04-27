import {
	VSCodeButton,
	VSCodeDropdown,
	VSCodeOption,
	VSCodeRadioGroup,
	VSCodeRadio,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import CommitForm from './CommitForm';
import BranchForm from './BranchForm';
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';

import cn from 'classnames';

const commitOptions = {
	NEW_BRANCH: 'newBranch',
	CURRENT_BRANCH: 'currentBranch',
};

type Props = Readonly<{
	loading: boolean;
	initialFormData: Partial<CommitChangesFormData>;
	remoteOptions: string[];
}>;

const initialFormState: CommitChangesFormData = {
	currentBranchName: '',
	newBranchName: '',
	remoteUrl: '',
	commitMessage: '',
	createNewBranch: false,
	stagedJobs: [],
};

const CreatePR = ({ loading, initialFormData, remoteOptions }: Props) => {
	const [formData, setFormData] =
		useState<CommitChangesFormData>(initialFormState);

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

	const { remoteUrl, createNewBranch, currentBranchName } = formData;

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			...initialFormData,
		}));
	}, [initialFormData]);

	const onChangeFormField =
		(fieldName: keyof CommitChangesFormData) =>
		(e: Event | React.FormEvent<HTMLElement>) => {
			const { checked, value } = e.target as HTMLInputElement;

			setFormData((prevFormData) => ({
				...prevFormData,
				[fieldName]: checked !== undefined ? checked : value,
			}));
		};

	const onChangeCommitOption = (e: Event | React.FormEvent<HTMLElement>) => {
		setFormData((prevData) => ({
			...prevData,
			createNewBranch:
				(e.target as HTMLInputElement).value ===
				commitOptions.NEW_BRANCH,
		}));
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
				<VSCodeRadioGroup
					orientation="vertical"
					value={
						createNewBranch
							? commitOptions.NEW_BRANCH
							: commitOptions.CURRENT_BRANCH
					}
				>
					<VSCodeRadio
						value={commitOptions.CURRENT_BRANCH}
						checked={!createNewBranch}
						onChange={onChangeCommitOption}
					>
						<span className={cn('codicon', 'codicon-git-commit')} />
						{`Commit directly to the "${currentBranchName}" branch.`}
					</VSCodeRadio>
					<VSCodeRadio
						value={commitOptions.NEW_BRANCH}
						checked={createNewBranch}
						onChange={onChangeCommitOption}
					>
						<span
							className={cn(
								'codicon',
								'codicon-git-pull-request',
							)}
						/>
						Create a <b>new branch</b> for this commit and start a
						pull request.
					</VSCodeRadio>
				</VSCodeRadioGroup>
				{createNewBranch ? <BranchForm formData={formData} /> : null}
				<div className={styles.actions}>
					<VSCodeButton
						appearance="primary"
						disabled={loading}
						type="submit"
						className={styles.actionButton}
					>
						Commit changes
					</VSCodeButton>
				</div>
			</form>
		</div>
	);
};

export default CreatePR;
