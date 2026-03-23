'use client';

import { Tag, getTagUsage } from '@/domain/tag';

import useSWR from 'swr';

interface UseTagUsageParams
{
	tagId: Tag['id'];
}

export function useTagUsage({ tagId }: UseTagUsageParams)
{
	const swrKey = ['tag-usage', tagId];
	const fetcher = () => getTagUsage(tagId);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return { data, isLoading, isValidating };
}
