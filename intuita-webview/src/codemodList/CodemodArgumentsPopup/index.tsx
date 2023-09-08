import { CodemodNodeHashDigest } from '../../../../src/selectors/selectCodemodTree';
import { vscode } from '../../shared/utilities/vscode';

import FormField from './FormField';
import styles from './styles.module.css';

import cn from 'classnames';

type Props = Readonly<{
	hashDigest: CodemodNodeHashDigest;
	arguments: ReadonlyArray<{
		kind: 'string' | 'number' | 'boolean';
		name: string;
		value: string;
	}>;
}>;

type FormData = Record<string, string>;

const buildFormDataFromArguments = (args: Props['arguments']): FormData => {
	return args.reduce<Record<string, string>>((formData, arg) => {
		formData[arg.name] = arg.value;
		return formData;
	}, {});
};

const CodemodArgumentsPopup = ({ hashDigest, arguments: args }: Props) => {
	const formData = buildFormDataFromArguments(args);

	const onChangeFormField =
		(fieldName: string) => (e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e as React.ChangeEvent<HTMLInputElement>).target
				.value;

			vscode.postMessage({
				kind: 'webview.global.setCodemodArguments',
				hashDigest,
				arguments: {
					...formData,
					[fieldName]: value,
				},
			});
		};

	const handleClose = () => {
		vscode.postMessage({
			kind: 'webview.global.setCodemodArgumentsPopupHashDigest',
			hashDigest: null,
		});
	};

	return (
		<div className={styles.root}>
			<span
				className={cn(styles.closeIcon, 'codicon codicon-close')}
				onClick={() => handleClose()}
			/>
			<h1>Codemod Arguments</h1>
			<form className={styles.form}>
				{args.map(({ kind, name }) => (
					<FormField
						kind={kind}
						name={name}
						value={formData[name] ?? ''}
						onChange={onChangeFormField(name)}
					/>
				))}
			</form>
		</div>
	);
};

export default CodemodArgumentsPopup;
