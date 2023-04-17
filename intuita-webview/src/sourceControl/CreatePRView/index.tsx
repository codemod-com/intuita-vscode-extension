import {
	VSCodeButton,
	VSCodeTextArea,
	VSCodeTextField,
	VSCodeDropdown,
	VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import { vscode } from '../../shared/utilities/vscode';
import WarningMessage from '../../shared/WarningMessage';

type Props = {
	loading: boolean;
	initialFormData: Partial<FormData>;
	baseBranchOptions: string[];
	targetBranchOptions: string[];
	remoteOptions: string[];
	pullRequestAlreadyExists: boolean;
};

type FormData = {
	baseBranch: string;
	targetBranch: string;
	title: string;
	body: string;
	remoteUrl: string | null;
};

const initialFormState: FormData = {
	baseBranch: 'main',
	targetBranch: '',
	title: '',
	body: '',
	remoteUrl: null,
};

const CreatePR = ({
	loading,
	initialFormData,
	baseBranchOptions,
	targetBranchOptions,
	remoteOptions,
	pullRequestAlreadyExists,
}: Props) => {
	const [formData, setFormData] = useState<FormData>(initialFormState);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.createPR.submitPR',
			value: formData,
		});
	};

	const { title, body, baseBranch, targetBranch, remoteUrl } = formData;

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			...initialFormData,
		}));
	}, [initialFormData]);

	const onChangeFormField =
		(fieldName: string) => (e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e as React.ChangeEvent<HTMLInputElement>).target
				.value;

			setFormData({
				...formData,
				[fieldName]: value,
			});
		};

	if (!remoteUrl) {
		return (
			<WarningMessage
				message="Unable to detect the git remote URI"
				actionButtons={[]}
			/>
		);
	}

	const hasMultipleRemotes = remoteOptions.length > 1;

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>
				Create Pull Request for {remoteUrl}
			</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
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
				<div className={styles.formField}>
					<label htmlFor="targetBranch">Target branch:</label>
					<VSCodeDropdown
						id="targetBranch"
						value={targetBranch}
						onChange={onChangeFormField('targetBranch')}
					>
						{targetBranchOptions.map((opt, index) => (
							<VSCodeOption value={opt} key={index}>
								{opt}
							</VSCodeOption>
						))}
					</VSCodeDropdown>
				</div>
				<div className={styles.formField}>
					<label htmlFor="baseBranch">Base branch:</label>
					<VSCodeDropdown
						id="baseBranch"
						value={baseBranch}
						onChange={onChangeFormField('baseBranch')}
					>
						{baseBranchOptions.map((opt, index) => (
							<VSCodeOption value={opt} key={index}>
								{opt}
							</VSCodeOption>
						))}
					</VSCodeDropdown>
				</div>
				{!pullRequestAlreadyExists ? (
					<>
						<VSCodeTextField
							placeholder="title"
							value={title}
							onInput={onChangeFormField('title')}
						>
							Title
						</VSCodeTextField>
						<VSCodeTextArea
							placeholder="Description"
							value={body}
							onInput={onChangeFormField('body')}
						>
							Body
						</VSCodeTextArea>
					</>
				) : null}
				<VSCodeButton type="submit" className={styles.submitButton}>
					{loading
						? 'Submitting...'
						: pullRequestAlreadyExists
						? 'Update Pull Request'
						: 'Create Pull Request'}
				</VSCodeButton>
			</form>
		</div>
	);
};

export default CreatePR;
