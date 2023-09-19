import {
	CodemodArgumentWithValue,
	CodemodNodeHashDigest,
} from '../../../../src/selectors/selectCodemodTree';
import { CodemodHash } from '../../shared/types';
import { vscode } from '../../shared/utilities/vscode';

import FormField from './FormField';
import styles from './styles.module.css';

import { DirectorySelector } from '../components/DirectorySelector';

import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/These';
import * as O from 'fp-ts/Option';

type Props = Readonly<{
	hashDigest: CodemodNodeHashDigest;
	arguments: ReadonlyArray<CodemodArgumentWithValue>;
	autocompleteItems: ReadonlyArray<string>;
	rootPath: string | null;
	executionPath: T.These<{ message: string }, string>;
}>;

const buildTargetPath = (path: string, rootPath: string) => {
	return path.replace(rootPath, '');
};

const CodemodArguments = ({
	hashDigest,
	arguments: args,
	autocompleteItems,
	rootPath,
	executionPath,
}: Props) => {
	const onChangeFormField = (fieldName: string) => (value: string) => {
		vscode.postMessage({
			kind: 'webview.global.setCodemodArgument',
			hashDigest,
			name: fieldName,
			value,
		});
	};

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

	const targetPath =
		rootPath !== null ? buildTargetPath(path, rootPath) : '/';

	return (
		<div className={styles.root}>
			<form className={styles.form}>
				<DirectorySelector
					defaultValue={targetPath}
					codemodHash={hashDigest as unknown as CodemodHash}
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

export default CodemodArguments;
