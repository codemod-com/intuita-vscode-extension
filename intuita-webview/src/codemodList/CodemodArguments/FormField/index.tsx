import {
	VSCodeCheckbox,
	VSCodeDropdown,
	VSCodeOption,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { CodemodArgumentWithValue } from '../../../../../src/selectors/selectCodemodTree';

type Props = CodemodArgumentWithValue & {
	onChange(e: Event | React.FormEvent<HTMLElement>): void;
};

const FormField = (props: Props) => {
	const { name, kind, value, description, required, onChange } = props;
	if (kind === 'string' || kind === 'number') {
		return (
			<VSCodeTextField
				placeholder={name}
				value={String(value)}
				onInput={onChange}
				className={styles.field}
				title={description}
			>
				{name} {required && '(required)'}
			</VSCodeTextField>
		);
	}

	if (kind === 'options') {
		return (
			<VSCodeDropdown onChange={onChange} value={value}>
				{props.options.map((o) => (
					<VSCodeOption value={o}>{o}</VSCodeOption>
				))}
			</VSCodeDropdown>
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
