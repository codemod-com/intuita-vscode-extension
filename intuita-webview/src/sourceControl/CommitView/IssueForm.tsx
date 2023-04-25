import { VSCodeTextArea, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';

type Props = {
	formData: CommitChangesFormData;
	onChangeFormField: (
		fieldName: keyof CommitChangesFormData,
	) => (e: Event | React.FormEvent<HTMLElement>) => unknown;
};

const IssueForm = ({ formData, onChangeFormField }: Props) => {
  const { issueTitle, issueBody } = formData;

	return (
    <>
    <VSCodeTextField
					placeholder="title"
					value={issueTitle}
					onInput={onChangeFormField('issueTitle')}
				>
					Title
				</VSCodeTextField>
				<VSCodeTextArea
					placeholder="Description"
					value={issueBody}
					onInput={onChangeFormField('issueBody')}
				>
					Description
				</VSCodeTextArea>
    </>
	);
};

export default IssueForm;
