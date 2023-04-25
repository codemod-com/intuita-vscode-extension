import {
	VSCodeDropdown,
	VSCodeOption,
	VSCodeTextArea,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';

type Props = {
	formData: CommitChangesFormData;
	onChangeFormField: (
		fieldName: keyof CommitChangesFormData,
	) => (e: Event | React.FormEvent<HTMLElement>) => unknown;
	targetBranchOptions: string[];
	baseBranchOptions: string[];
};

const PullRequestForm = ({
	formData,
	targetBranchOptions,
	baseBranchOptions,
	onChangeFormField,
}: Props) => {
	return (
		<>
			<div className={styles.formField}>
				<label htmlFor="targetBranch">Target branch:</label>
				<VSCodeDropdown
					id="targetBranch"
					value={formData.targetBranchName}
					onChange={onChangeFormField('targetBranchName')}
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
					value={formData.currentBranchName}
					onChange={onChangeFormField('currentBranchName')}
				>
					{baseBranchOptions.map((opt, index) => (
						<VSCodeOption value={opt} key={index}>
							{opt}
						</VSCodeOption>
					))}
				</VSCodeDropdown>
			</div>
			<>
				<VSCodeTextField
					placeholder="title"
					value={formData.pullRequestTitle}
					onInput={onChangeFormField('pullRequestTitle')}
				>
					Title
				</VSCodeTextField>
				<VSCodeTextArea
					placeholder="Description"
					value={formData.pullRequestBody}
					onInput={onChangeFormField('pullRequestBody')}
				>
					Body
				</VSCodeTextArea>
			</>
		</>
	);
};

export default PullRequestForm;
