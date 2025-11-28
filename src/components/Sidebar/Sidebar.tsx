'use client';

import styles from './Sidebar.module.css';
import { useState, useEffect } from 'react';
import { Pagination } from '@components/Pagination';
import { ItemList } from '@components/Items';
import { SearchBar } from '@/components/SearchBar';
import { getItems, getTotalItems } from '@/lib/items';
import { Item } from '@prisma/client';

export default function Sidebar()
{
	const [pageSize, setPageSize] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [search, setSearch] = useState('');
	const [items, setItems] = useState<Item[]>([]);
	const [totalItems, setTotalItems] = useState<number>(0);

	useEffect(() =>
	{
		async function load()
		{
			if (pageSize > 0)
			{
				const [fetchedItems, total] = await Promise.all([getItems({ page, pageSize, search }), getTotalItems({ search })]);
				setItems(fetchedItems);
				setTotalItems(total);
			}
		}

		load();
	}, [page, pageSize, search]);

	const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;

	return (
		<div className={styles.sidebar}>
			<Pagination totalPages={totalPages} currentPage={page} onPageChanged={setPage} />
			<ItemList items={items} onPageSizeChanged={setPageSize} />
			<SearchBar search={search} onSearchChanged={setSearch} />
		</div>
	);
}
