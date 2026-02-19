'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useItemFilters()
{
	const router = useRouter();
	const searchParams = useSearchParams();

	const rawSearch = searchParams.get('search');
	const rawTags = searchParams.get('tags');

	const searchTerm = rawSearch?.trim() || null;
	const tags = rawTags?.split(',').filter(Boolean) || null;

	const setSearchTerm = useCallback(
		function setSearchTerm(term: string | null)
		{
			const params = new URLSearchParams(window.location.search);

			if (term === null || term.trim() === '')
			{
				params.delete('search');
			}
			else
			{
				params.set('search', term);
			}

			router.push(`?${params.toString()}`);
		},
		[router],
	);

	const setTags = useCallback(
		function setTags(newTags: string[] | null)
		{
			const params = new URLSearchParams(window.location.search);

			if (!newTags || newTags.length === 0)
			{
				params.delete('tags');
			}
			else
			{
				params.set('tags', newTags.join(','));
			}

			router.push(`?${params.toString()}`);
		},
		[router],
	);

	return {
		searchTerm,
		tags,
		setSearchTerm,
		setTags,
	};
}
