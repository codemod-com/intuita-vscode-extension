import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import styles from './style.module.css';

type Props = {
	searchQuery: string;
	setSearchQuery: Dispatch<SetStateAction<string>>;
};

export const SEARCH_QUERY_MIN_LENGTH = 3;

const SearchBar = ({ searchQuery, setSearchQuery }: Props) => {
	return (
		<VSCodeTextField
			type="text"
			value={searchQuery}
			placeholder="Search files..."
			onInput={(event: any) => {
				setSearchQuery((prev) => event.target?.value ?? prev);
			}}
			className={styles.container}
		>
			<span slot="start" className={cn('codicon', 'codicon-search')} />
		</VSCodeTextField>
	);
};

export default SearchBar;
