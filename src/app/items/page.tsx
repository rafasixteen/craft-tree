'use server';

import { useState, useEffect } from 'react';
import SearchBar from './_components/SearchBar';
import Pagination from './_components/Pagination';
import ItemsList from './_components/ItemsList';
import { getItems } from '@/lib/api/items';

export default function ItemsPage()
{
	const [items, setItems] = useState<Item[]>([]);
	const [page, setPage] = useState(0);
	const [search, setSearch] = useState('');
	const [hasNext, setHasNext] = useState(false);

	useEffect(() =>
	{
		async function fetchItems()
		{
			try
			{
				const data: Item[] = await getItems(page);
				const filtered = data.filter((i: Item) => i.name.toLowerCase().includes(search.toLowerCase()));
				setItems(filtered);
				setHasNext(data.length === 20);
			}
			catch (err)
			{
				console.error(err);
			}
		}

		fetchItems();
	}, [page, search]);

	return (
		<div className="p-4">
			<SearchBar value={search} onChange={setSearch} />
			<ItemsList items={items} />
			<Pagination page={page} onPageChange={setPage} hasNext={hasNext} />
		</div>
	);
}
