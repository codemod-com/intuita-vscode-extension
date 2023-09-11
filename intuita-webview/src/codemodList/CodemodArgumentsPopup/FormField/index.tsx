import {
	VSCodeCheckbox,
	VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';

type Props = Readonly<{
	kind: 'string' | 'boolean' | 'number';
	name: string;
	value: string;
	onChange(e: Event | React.FormEvent<HTMLElement>): void;
}>;

const FormField = ({ kind, name, value, onChange }: Props) => {
	if (kind === 'string' || kind === 'number') {
		return (
			<VSCodeTextField
				placeholder={name}
				value={value}
				onInput={onChange}
				className={styles.field}
			>
				{name}
			</VSCodeTextField>
		);
	}

	return <VSCodeCheckbox checked={value === 'true'} onChange={onChange} />;
};

export default FormField;
