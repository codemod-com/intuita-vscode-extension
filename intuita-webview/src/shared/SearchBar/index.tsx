import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import cn from 'classnames';
import styles from './style.module.css';
import { useRef } from 'react';
import useFocus from '../useFocus';

type Props = Readonly<{
	searchPhrase: string;
	setSearchPhrase: (searchPhrase: string) => void;
	placeholder: string;
}>;

export const SEARCH_QUERY_MIN_LENGTH = 1;

const SearchBar = (props: Props) => {
	const ref = useRef<HTMLDivElement>(null);

	useFocus(ref, 'searchBar');

	return (
		<div ref={ref}>
			<VSCodeTextField
				type="text"
				value={props.searchPhrase}
				placeholder={props.placeholder}
				onInput={(event) => {
					if (
						event.target === null ||
						!('value' in event.target) ||
						typeof event.target.value !== 'string'
					) {
						return;
					}

					props.setSearchPhrase(event.target.value);
				}}
				className={styles.container}
			>
				<span
					slot="start"
					className={cn('codicon', 'codicon-search')}
				/>
			</VSCodeTextField>
		</div>
	);
};

export default SearchBar;
