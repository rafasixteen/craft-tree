'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './search-bar.module.css';

export default function SearchBar()
{
	const router = useRouter();
	const searchParams = useSearchParams();

	const [search, setSearch] = useState(searchParams.get('search') ?? '');

	function onInputChanged(event: React.ChangeEvent<HTMLInputElement>)
	{
		setSearch(event.target.value);
	}

	useEffect(() =>
	{
		const newParams = new URLSearchParams(searchParams.toString());

		if (search)
		{
			newParams.set('search', search);
		}
		else
		{
			newParams.delete('search');
		}

		router.push(`?${newParams.toString()}`);
	}, [router, searchParams, search]);

	return (
		<div className={styles['search-bar']}>
			<input type="text" placeholder="Search..." value={search} onChange={onInputChanged} />
		</div>
	);
}
