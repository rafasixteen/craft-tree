'use server';

import { z } from 'zod';
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

const SearchParamsSchema = z.object({
	page: z.coerce.number().positive().optional().default(1),
	search: z.string().max(32).optional().default(''),
});

export default async function ItemsPage({ searchParams }: { searchParams: Promise<ItemsPageProps> })
{
	let page: number = 1;
	let search: string = '';

	try
	{
		const params = await searchParams;

		const parsed = SearchParamsSchema.parse({
			page: params.page,
			search: params.search,
		});

		page = parsed.page;
		search = parsed.search;
	}
	catch
	{
		return redirect(`/items?page=1&search=`);
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
