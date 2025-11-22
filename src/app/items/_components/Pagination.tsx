'use client';

import { setPage } from '@/lib/cookies/items-query-client';
import { useRouter } from 'next/navigation';

export default function Pagination({ page }: { page: number })
{
	const router = useRouter();
	const currentPage = page;

	async function goToPreviousPage()
	{
		const newPage = Math.max(1, currentPage - 1);
		await setPage(newPage);
		router.refresh();
	}

	async function goToNextPage()
	{
		const newPage = currentPage + 1;
		await setPage(newPage);
		router.refresh();
	}

	return (
		<div>
			<button onClick={goToPreviousPage}>Prev</button>
			<span>{currentPage}</span>
			<button onClick={goToNextPage}>Next</button>
		</div>
	);
}
