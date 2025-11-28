'use client';

import styles from './SearchBar.module.css';

interface SearchBarProps
{
	search: string;
	onSearchChanged: (value: string) => void;
}

export default function SearchBar({ search, onSearchChanged }: SearchBarProps)
{
	function onInputChanged(event: React.ChangeEvent<HTMLInputElement>)
	{
		onSearchChanged(event.target.value);
	}

	return (
		<div className={styles['search-bar']}>
			<input type="text" placeholder="Search..." value={search} onChange={onInputChanged} />
		</div>
	);
}
