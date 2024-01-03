import {
	VSCodeCheckbox,
	VSCodeDropdown,
	VSCodeOption,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';
import { CodemodArgumentWithValue } from '../../../../../src/selectors/selectCodemodTree';

type Props = CodemodArgumentWithValue & {
	onChange(value: string): void;
};

const FormField = (props: Props) => {
	const { name, kind, value, description, required, onChange } = props;
	if (kind === 'string' || kind === 'number') {
		return (
			<VSCodeTextField
				placeholder={name}
				value={String(value)}
				// @ts-expect-error value exists on target
				onInput={(e) => onChange(e.target.value)}
				className={styles.field}
				title={description}
			>
				{name} {required && '(required)'}
			</VSCodeTextField>
		);
	}

	if (kind === 'options') {
		return (
			<VSCodeDropdown
				// @ts-expect-error value exists on target
				onChange={(e) => e.target.value}
				value={value}
			>
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
				onChange={(e) => {
					// @ts-expect-error checked prop
					onChange(String(e.target.checked));
				}}
			/>
		</div>
	);
};

export default FormField;
