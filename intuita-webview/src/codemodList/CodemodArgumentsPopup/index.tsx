import {
	CodemodArgumentWithValue,
	CodemodNode,
	CodemodNodeHashDigest,
} from '../../../../src/selectors/selectCodemodTree';
import { CodemodHash } from '../../shared/types';
import { vscode } from '../../shared/utilities/vscode';

import FormField from './FormField';
import styles from './styles.module.css';

import cn from 'classnames';
import debounce from '../../shared/utilities/debounce';
import { DirectorySelector } from '../components/DirectorySelector';

import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';

type Props = Readonly<{
	hashDigest: CodemodNodeHashDigest;
	arguments: ReadonlyArray<CodemodArgumentWithValue>;
	autocompleteItems: ReadonlyArray<string>;
	rootPath: string | null;
	executionPath: (CodemodNode & { kind: 'CODEMOD' })['executionPath'];
}>;

const buildTargetPath = (path: string, rootPath: string, repoName: string) => {
	return path.replace(rootPath, '').length === 0
		? `${repoName}/`
		: path.replace(rootPath, repoName);
};

const handleCodemodPathChange = debounce((rawCodemodPath: string) => {
	const codemodPath = rawCodemodPath.trim();

	vscode.postMessage({
		kind: 'webview.codemodList.codemodPathChange',
		codemodPath,
	});
}, 50);

const CodemodArgumentsPopup = ({
	hashDigest,
	arguments: args,
	autocompleteItems,
	rootPath,
	executionPath,
}: Props) => {
	const onChangeFormField =
		(fieldName: string) => (e: Event | React.FormEvent<HTMLElement>) => {
			const value = (e as React.ChangeEvent<HTMLInputElement>).target
				.value;

			vscode.postMessage({
				kind: 'webview.global.setCodemodArguments',
				hashDigest,
				name: fieldName,
				value,
			});
		};

	const handleClose = () => {
		vscode.postMessage({
			kind: 'webview.global.setCodemodArgumentsPopupHashDigest',
			hashDigest: null,
		});
	};

	const error: string | null = pipe(
		O.fromNullable(executionPath),
		O.fold(
			() => null,
			T.fold(
				({ message }) => message,
				() => null,
				({ message }) => message,
			),
		),
	);

	const path: string = pipe(
		O.fromNullable(executionPath),
		O.fold(
			() => '',
			T.fold(
				() => '',
				(p) => p,
				(_, p) => p,
			),
		),
	);

	const repoName =
		rootPath !== null ? rootPath.split('/').slice(-1)[0] ?? '' : '';

	const targetPath =
		rootPath !== null ? buildTargetPath(path, rootPath, repoName) : '/';

	return (
		<div className={styles.root}>
			<span
				className={cn(styles.closeIcon, 'codicon codicon-close')}
				onClick={() => handleClose()}
			/>
			<h1>Codemod Arguments</h1>
			<form className={styles.form}>
				<DirectorySelector
					defaultValue={targetPath}
					displayValue={'path'}
					rootPath={rootPath ?? ''}
					error={error === null ? null : { message: error }}
					codemodHash={hashDigest as unknown as CodemodHash}
					onChange={handleCodemodPathChange}
					autocompleteItems={autocompleteItems}
				/>
				{args.map((props) => (
					<FormField
						{...props}
						onChange={onChangeFormField(props.name)}
					/>
				))}
			</form>
		</div>
	);
};

export default CodemodArgumentsPopup;
