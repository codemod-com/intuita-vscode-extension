import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { FormData } from '.';

type Props = {
	formData: FormData;
	onChangeFormField: (
		fieldName: keyof FormData,
	) => (e: Event | React.FormEvent<HTMLElement>) => unknown;
};

const CommitForm = ({ formData, onChangeFormField }: Props) => {
	return (
		<VSCodeTextField
			placeholder="Message"
			value={formData.commitMessage}
			onInput={onChangeFormField('commitMessage')}
		>
			Message
		</VSCodeTextField>
	);
};

export default CommitForm;
