'use client';

import { getProducerOutputs } from '@/domain/producer';
import useSWR from 'swr';

type UseProducerOutputsParams = Partial<Parameters<typeof getProducerOutputs>[0]>;

export function useProducerOutputs({ producerId }: UseProducerOutputsParams)
{
	const swrKey = producerId ? ['producer-outputs', producerId] : null;
	const fetcher = () => (producerId ? getProducerOutputs({ producerId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		outputs: data,
		isLoading,
		isValidating,
	};
}
