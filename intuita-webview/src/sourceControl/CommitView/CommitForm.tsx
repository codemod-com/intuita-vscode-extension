import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';

type Props = {
	formData: CommitChangesFormData;
	onChangeFormField: (
		fieldName: keyof CommitChangesFormData,
	) => (e: Event | React.FormEvent<HTMLElement>) => unknown;
};

const CommitForm = ({ formData, onChangeFormField }: Props) => {
	return (
		<VSCodeTextField
			placeholder="Message"
			value={formData.commitMessage}
			onInput={onChangeFormField('commitMessage')}
		>
			Commit message
		</VSCodeTextField>
	);
};

export default CommitForm;
