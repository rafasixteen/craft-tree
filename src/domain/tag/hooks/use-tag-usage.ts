'use client';

import { getTagUsage, Tag } from '@/domain/tag';
import useSWR from 'swr';

export function useTagUsage(tagId: Tag['id'])
{
	const swrKey = ['tag-usage', tagId];
	const fetcher = () => getTagUsage(tagId);

	const { data } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	return data;
}
