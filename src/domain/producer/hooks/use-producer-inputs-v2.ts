'use client';

import { getProducerInputs, Producer, setProducerInputs } from '@/domain/producer';
import { useCallback } from 'react';
import useSWR from 'swr';

type SetInputsParams = Omit<Parameters<typeof setProducerInputs>[0], 'producerId'>;

export function useProducerInputsV2(producerId?: Producer['id'])
{
	const swrKey = producerId ? ['producer-inputs', producerId] : null;
	const fetcher = () => (producerId ? getProducerInputs(producerId) : null);

	const { data: inputs, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const setInputs = useCallback(
		async function setInputs({ inputs }: SetInputsParams)
		{
			if (!producerId)
			{
				throw new Error('Producer ID is required to set inputs');
			}

			const optimistic = inputs.map((input, index) => ({
				id: `temp-${index}`,
				...input,
				producerId,
			}));

			await mutate(
				async () =>
				{
					return await setProducerInputs({ producerId, inputs });
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
		inputs: inputs,
		setInputs,
	};
}
