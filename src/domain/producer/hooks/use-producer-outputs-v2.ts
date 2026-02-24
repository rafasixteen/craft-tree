'use client';

import { getProducerOutputs, Producer, setProducerOutputs } from '@/domain/producer';
import { useCallback } from 'react';
import useSWR from 'swr';

type SetOutputsParams = Omit<Parameters<typeof setProducerOutputs>[0], 'producerId'>;

export function useProducerOutputsV2(producerId?: Producer['id'])
{
	const swrKey = producerId ? ['producer-outputs', producerId] : null;
	const fetcher = () => (producerId ? getProducerOutputs(producerId) : null);

	const { data: outputs, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const setOutputs = useCallback(
		async function setOutputs({ outputs }: SetOutputsParams)
		{
			if (!producerId)
			{
				throw new Error('Producer ID is required to set outputs');
			}

			const optimistic = outputs.map((output, index) => ({
				id: `temp-${index}`,
				...output,
				producerId,
			}));

			await mutate(
				async () =>
				{
					return await setProducerOutputs({ producerId, outputs });
				},
				{
					optimisticData: optimistic,
					rollbackOnError: true,
					revalidate: false,
				},
			);
		},
		[producerId, mutate],
	);

	return {
		outputs: outputs ?? [],
		setOutputs,
	};
}
