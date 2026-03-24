'use client';

import { getTagUsage } from '@/domain/tag';

import useSWR from 'swr';

type UseTagUsageParams = Partial<Parameters<typeof getTagUsage>[0]>;

export function useTagUsage({ tagId }: UseTagUsageParams)
{
	const swrKey = tagId ? ['tag-usage', tagId] : null;
	const fetcher = () => (tagId ? getTagUsage({ tagId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return { usage: data, isLoading, isValidating };
}
