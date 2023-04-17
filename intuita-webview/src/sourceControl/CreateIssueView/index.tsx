import {
	VSCodeButton,
	VSCodeDropdown,
	VSCodeOption,
	VSCodeTextArea,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';

type FormData = Readonly<{
	title: string;
	body: string;
	remoteUrl: string;
}>;

type Props = Readonly<{
	loading: boolean;
	initialFormData: Partial<FormData>;
	remoteOptions: string[];
}>;

const initialFormState: FormData = {
	title: '',
	body: '',
	remoteUrl: '',
};

const CreateIssue = ({ loading, initialFormData, remoteOptions }: Props) => {
	const [formData, setFormData] = useState<FormData>(initialFormState);

	const { title, body, remoteUrl } = formData;

	useEffect(() => {
		setFormData((prevFormData) => ({
			...prevFormData,
			...initialFormData,
		}));
	}, [initialFormData]);

	const onChangeFormField =
		(fieldName: keyof FormData) =>
		(e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e as React.ChangeEvent<HTMLInputElement>).target
				.value;

			setFormData({
				...formData,
				[fieldName]: value,
			});
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		vscode.postMessage({
			kind: 'webview.createIssue.submitIssue',
			value: formData,
		});
	};

	const hasMultipleRemotes = remoteOptions.length > 1;

	return (
		<div className={styles.root}>
			<h1 className={styles.header}>Create an Issue</h1>
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
					Description
				</VSCodeTextArea>
				<VSCodeButton type="submit" className={styles.submitButton}>
					{loading ? 'Submitting...' : 'Create Issue'}
				</VSCodeButton>
			</form>
		</div>
	);
};

export default CreateIssue;
