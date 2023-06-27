import { useCallback, useRef, useState } from 'react';

import { CodemodHash } from '../../shared/types';

import DirectorySelectorTrigger from './DirectorySelectorTrigger';
import DirectorySelectorEditor from './DirectorySelectorEditor';

type Props = {
	defaultValue: string;
	rootPath: string;
	codemodHash: CodemodHash;
	error: { message: string } | null;
	autocompleteItems: ReadonlyArray<string>;
	notEnoughSpace: boolean;
	onEditStart(): void;
	onEditEnd(): void;
	onEditCancel(): void;
	onChange(value: string): void;
};

export const DirectorySelector = ({
	defaultValue,
	rootPath,
	codemodHash,
	notEnoughSpace,
	error,
	autocompleteItems,
	onEditStart,
	onEditEnd,
	onEditCancel,
	onChange,
}: Props) => {
	const repoName =
		rootPath
			.split('/')
			.filter((part) => part.length !== 0)
			.slice(-1)[0] ?? '';
	const [editing, setEditing] = useState(false);
	const ignoreBlurEvent = useRef(false);

	const handleDoubleClick = useCallback(() => {
		setEditing(true);
		onEditStart();
		ignoreBlurEvent.current = false;
	}, [setEditing, onEditStart]);

	if (!editing) {
		return (
			<DirectorySelectorTrigger
				onDoubleClick={handleDoubleClick}
				notEnoughSpace={notEnoughSpace}
				repoName={repoName}
				value={defaultValue}
			/>
		);
	}

	return (
		<DirectorySelectorEditor
			defaultValue={defaultValue}
			rootPath={rootPath}
			codemodHash={codemodHash}
			error={error}
			autocompleteItems={autocompleteItems}
			onEditStart={onEditStart}
			onEditEnd={onEditEnd}
			onEditCancel={onEditCancel}
			onChange={onChange}
			setEditing={setEditing}
		/>
	);
};
