'use client';

import { getGraphById } from '@/domain/graph';
import useSWR from 'swr';

type UseGraphParams = Partial<Parameters<typeof getGraphById>[0]>;

export function useGraph({ graphId }: UseGraphParams)
{
	const swrKey = graphId ? ['graph', graphId] : null;
	const fetcher = () => (graphId ? getGraphById({ graphId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		graph: data,
		isLoading,
		isValidating,
	};
}
