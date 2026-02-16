'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useItemFilters()
{
	const searchParams = useSearchParams();
	const router = useRouter();

	const searchTerm = searchParams.get('search');
	const tagParams = searchParams.get('tags');

	const tags = tagParams ? tagParams.split(',') : null;

	const setSearchTerm = useCallback(
		function setSearchTerm(term: string | null)
		{
			const params = new URLSearchParams(searchParams.toString());

			if (term === null)
			{
				params.delete('search');
			}
			else
			{
				params.set('search', term);
			}

			router.push(`?${params.toString()}`);
		},
		[router, searchParams],
	);

	const setTags = useCallback(
		function setTags(tags: string[] | null)
		{
			const params = new URLSearchParams(searchParams.toString());

			if (tags === null || tags.length === 0)
			{
				params.delete('tags');
			}
			else
			{
				params.set('tags', tags.join(','));
			}

			router.push(`?${params.toString()}`);
		},
		[router, searchParams],
	);

	return {
		searchTerm: searchTerm ?? undefined,
		tags: tags ?? undefined,
		setSearchTerm,
		setTags,
	};
}
