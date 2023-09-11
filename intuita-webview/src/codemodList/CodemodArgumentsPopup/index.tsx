import { useCallback, useState } from 'react';
import {
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
	arguments: ReadonlyArray<{
		kind: 'string' | 'number' | 'boolean';
		name: string;
		value: string;
	}>;
	autocompleteItems: ReadonlyArray<string>;
	rootPath: string | null;
	executionPath: (CodemodNode & { kind: 'CODEMOD' })['executionPath'];
}>;

type FormData = Record<string, string>;

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

const buildFormDataFromArguments = (args: Props['arguments']): FormData => {
	return args.reduce<Record<string, string>>((formData, arg) => {
		formData[arg.name] = arg.value;
		return formData;
	}, {});
};

const CodemodArgumentsPopup = ({
	hashDigest,
	arguments: args,
	autocompleteItems,
	rootPath,
	executionPath,
}: Props) => {
	const [editingPath, setEditingPath] = useState(false);

	const onEditStart = useCallback(() => {
		setEditingPath(true);
	}, []);

	const onEditEnd = useCallback(() => {
		setEditingPath(false);
	}, []);

	const onEditCancel = useCallback(() => {
		setEditingPath(false);
	}, []);

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
					onEditStart={onEditStart}
					onEditEnd={onEditEnd}
					onEditCancel={onEditCancel}
					onChange={handleCodemodPathChange}
					autocompleteItems={autocompleteItems}
				/>
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
