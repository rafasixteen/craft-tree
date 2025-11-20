'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ page, hasNext }: { page: number; hasNext: boolean })
{
	const router = useRouter();
	const params = useSearchParams();

	const updatePage = (newPage: number) =>
	{
		const newParams = new URLSearchParams(params.toString());
		newParams.set('page', String(newPage));
		router.push(`?${newParams.toString()}`);
	};

	return (
		<div className="flex gap-2">
			<button disabled={page <= 1} onClick={() => updatePage(page - 1)}>
				Prev
			</button>

			<button disabled={!hasNext} onClick={() => updatePage(page + 1)}>
				Next
			</button>
		</div>
	);
}
