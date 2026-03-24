'use client';

import { getTagById } from '@/domain/tag';

import useSWR from 'swr';

type UseTagParams = Partial<Parameters<typeof getTagById>[0]>;

export function useTag({ tagId }: UseTagParams)
{
	const swrKey = tagId ? ['tag', tagId] : null;
	const fetcher = () => (tagId ? getTagById({ tagId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return { tag: data, isLoading, isValidating };
}
