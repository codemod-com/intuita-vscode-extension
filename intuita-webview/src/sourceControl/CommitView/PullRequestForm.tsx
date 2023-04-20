import {
	VSCodeDropdown,
	VSCodeOption,
	VSCodeTextArea,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { FormData } from '.';

type Props = {
	formData: FormData;
	onChangeFormField: (
		fieldName: keyof FormData,
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
					value={formData.targetBranch}
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
					value={formData.baseBranch}
					onChange={onChangeFormField('baseBranch')}
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
					value={formData.title}
					onInput={onChangeFormField('title')}
				>
					Title
				</VSCodeTextField>
				<VSCodeTextArea
					placeholder="Description"
					value={formData.body}
					onInput={onChangeFormField('body')}
				>
					Body
				</VSCodeTextArea>
			</>
		</>
	);
};

export default PullRequestForm;
