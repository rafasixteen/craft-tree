'use client';

import { getProducerInputs } from '@/domain/producer';
import useSWR from 'swr';

type UseProducerInputsParams = Partial<Parameters<typeof getProducerInputs>[0]>;

export function useProducerInputs({ producerId }: UseProducerInputsParams)
{
	const swrKey = producerId ? ['producer-inputs', producerId] : null;
	const fetcher = () => (producerId ? getProducerInputs({ producerId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		inputs: data,
		isLoading,
		isValidating,
	};
}
