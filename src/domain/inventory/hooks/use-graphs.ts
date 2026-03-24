'use client';

import { getGraphs } from '@/domain/inventory';
import useSWR from 'swr';

type UseGraphsParams = Partial<Parameters<typeof getGraphs>[0]>;

export function useGraphs({ inventoryId }: UseGraphsParams)
{
	const swrKey = inventoryId ? ['graphs', inventoryId] : null;
	const fetcher = () => (inventoryId ? getGraphs({ inventoryId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		graphs: data,
		isLoading,
		isValidating,
	};
}
