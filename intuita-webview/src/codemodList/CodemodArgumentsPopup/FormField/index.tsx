import {
	VSCodeCheckbox,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { CodemodArgumentWithValue } from '../../../../../src/selectors/selectCodemodTree';

type Props = CodemodArgumentWithValue & {
	onChange(e: Event | React.FormEvent<HTMLElement>): void;
};

const FormField = ({
	kind,
	name,
	required,
	value,
	description,
	onChange,
}: Props) => {
	if (kind === 'string' || kind === 'number') {
		return (
			<VSCodeTextField
				placeholder={name}
				value={String(value)}
				onInput={onChange}
				className={styles.field}
				title={description}
			>
				{name} {required && '*'}
			</VSCodeTextField>
		);
	}

	return (
		<div className={styles.fieldLayout}>
			<label className={styles.label}>
				{name} {required && '*'}
			</label>
			<VSCodeCheckbox
				title={description}
				checked={value}
				onChange={onChange}
			/>
		</div>
	);
};

export default FormField;
