'use client';

import * as ProducerServerActions from '@/domain/producer/server';
import useSWR from 'swr';

type UseProducerParams = Partial<Parameters<typeof ProducerServerActions.getProducerById>[0]>;

export function useProducer({ producerId }: UseProducerParams)
{
	const swrKey = producerId ? ['producer', producerId] : null;
	const fetcher = () => (producerId ? ProducerServerActions.getProducerById({ producerId }) : null);

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		producer: data,
		isLoading,
		isValidating,
	};
}
