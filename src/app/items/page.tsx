'use server';

import ItemsList from './_components/ItemsList';
import Pagination from './_components/Pagination';
import SearchBar from './_components/SearchBar';
import { getItems } from '@/lib/api/items';
import { redirect } from 'next/navigation';

interface ItemsPageProps
{
	page: string | undefined;
	search: string | undefined;
}

function validatePage(page?: string): number | null
{
	const p = parseInt(page ?? '1', 10);
	if (isNaN(p) || p < 1) return null;
	return p;
}

function validateSearch(search?: string): string
{
	if (!search || typeof search !== 'string') return '';
	return search.slice(0, 32);
}

export default async function ItemsPage({ searchParams }: { searchParams: Promise<ItemsPageProps> })
{
	const params = await searchParams;
	const page = validatePage(params.page);
	const search = validateSearch(params.search);

	if (page === null)
	{
		redirect(`/items?search=${encodeURIComponent(search)}&page=1`);
	}

	const { items, hasNext } = await getItems(page, search);

	return (
		<div className="p-4">
			<Pagination page={page} hasNext={hasNext} />

			<div className="my-6">
				<ItemsList items={items} />
			</div>

			<SearchBar search={search} />
		</div>
	);
}
