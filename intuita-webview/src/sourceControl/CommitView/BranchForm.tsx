import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';

type Props = {
	formData: CommitChangesFormData;
};

const BranchForm = ({ formData }: Props) => {
	return (
		<VSCodeTextField readOnly value={formData.targetBranchName}>
			Branch
		</VSCodeTextField>
	);
};

export default BranchForm;
