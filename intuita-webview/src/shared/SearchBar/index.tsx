import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import styles from './style.module.css';

type Props = {
	searchQuery: string;
	setSearchQuery: Dispatch<SetStateAction<string>>;
	placeholder: string;
};

export const SEARCH_QUERY_MIN_LENGTH = 3;

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }: Props) => {
	return (
		<VSCodeTextField
			type="text"
			value={searchQuery}
			placeholder={placeholder}
			onInput={(event: Event | React.FormEvent<HTMLElement>) => {
				setSearchQuery(
					(prev) => (event.target as HTMLInputElement).value ?? prev,
				);
			}}
			className={styles.container}
		>
			<span slot="start" className={cn('codicon', 'codicon-search')} />
		</VSCodeTextField>
	);
};

export default SearchBar;
