import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { FormData } from '.';

type Props = {
	formData: FormData;
};

const BranchForm = ({ formData }: Props) => {
	return (
		<VSCodeTextField
      readOnly
			value={formData.branchName}
		>
			Branch
		</VSCodeTextField>
	);
};

export default BranchForm;