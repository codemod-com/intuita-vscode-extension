import Editor, { EditorProps, DiffEditorProps, Monaco } from '@monaco-editor/react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import configure from './configure';

type MorePropsFromEditor = {
	folding?: boolean;
	lineNumbers?:
		| 'on'
		| 'off'
		| 'relative'
		| 'interval'
		| ((lineNumber: number) => string);
	minimap?: {
		enabled: boolean;
	};
	readOnly?: boolean;
	renderLineHighlight?: 'none' | 'gutter' | 'line' | 'all';
} & DiffEditorProps

type CustomProps = {
	id?: string;
	persistValue?: {
		key: string;
	};
	placeholder?: string;
	onBlur?(value: string): void;
	onClick?(position: number): void;
	onKeyUp?: ({
		offset,
		event,
	}: {
		offset: number;
		event: monaco.IKeyboardEvent;
	}) => void;
};

const MonacoEditor = forwardRef<
	monaco.editor.IStandaloneCodeEditor,
	EditorProps & CustomProps & MorePropsFromEditor & DiffEditorProps
>(
	(
		{
			theme,

			persistValue,
			onClick,
			onKeyUp,
			onBlur,
			onChange,
			...restProps
		},
		ref,
	) => {
		const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
		const monacoRef = useRef<Monaco>();
	
		const isFirstRender = useRef(true);

		const [placeholderVisible, setPlaceholderVisible] = useState(
			!restProps.value,
		);

		const [isMounted, setIsMounted] = useState(false);

		// @TODO clean up code duplication
		useEffect(() => {
			const editor = editorRef.current;

			if (!editor || !isMounted) {
				return;
			}

			const handleBlur = () => {
				if (onBlur) {
					const value = editor.getValue();
					onBlur(value);
				}
			};

			const disposable = editor.onDidBlurEditorWidget(handleBlur);

			// eslint-disable-next-line consistent-return
			return () => {
				// @TODO make single bindListeners fn that will bind/dispose all listeners
				disposable.dispose();
			};
		}, [onBlur, isMounted]);

		useEffect(() => {
			const editor = editorRef.current;
			if (!editor) {
				return;
			}
			editor.updateOptions({
				fixedOverflowWidgets: true,
				...restProps,
			});
		}, [restProps, theme]);

		const key = persistValue?.key;

		useEffect(() => {
			if (!key || !isMounted) {
				return;
			}

			if (isFirstRender.current) {
				const savedValue = localStorage.getItem(key);

				if (savedValue) {
					editorRef.current?.setValue(savedValue);
					isFirstRender.current = false;
				}
			}
		}, [isMounted, key]);

		const value = restProps?.value;

		useEffect(() => {
			if (value && key && !isFirstRender.current) {
				const savedValue = localStorage.getItem(key);

				if (savedValue !== value) {
					localStorage.setItem(key, value);
				}
			}
		}, [value, key]);

		return (
			<div className="relative w-full h-full">
				<Editor
					onChange={(v, ev) => {
						setPlaceholderVisible(!v);

						if (onChange) {
							onChange(v, ev);
						}
					}}
					onMount={(editor, m) => {
						editorRef.current = editor;
						monacoRef.current = m;
						if (typeof ref === 'function') {
							ref(editor);
						} else if (ref) {
							// eslint-disable-next-line no-param-reassign
							ref.current = editor;
						}

						configure(m);
					 
						editor.updateOptions({
							wordWrap: 'on',
							wrappingIndent: 'indent',
							minimap: {
								enabled: false,
							},
							...restProps,
						});

						setIsMounted(true);
					}}
					{...restProps}
				/>
				{restProps.placeholder && placeholderVisible ? (
					<pre className="monaco-placeholder">
						{restProps.placeholder}
					</pre>
				) : null}
			</div>
		);
	},
);

export default MonacoEditor;
