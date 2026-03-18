'use client';

import {
	getProducerInputs,
	Producer,
	setProducerInputs,
} from '@/domain/producer';
import { useCallback } from 'react';
import useSWR from 'swr';

type SetInputsParams = Omit<
	Parameters<typeof setProducerInputs>[0],
	'producerId'
>;

export function useProducerInputs(producerId: Producer['id'])
{
	const swrKey = ['producer-inputs', producerId];
	const fetcher = () => getProducerInputs(producerId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const setInputs = useCallback(
		async function setInputs({ inputs }: SetInputsParams)
		{
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

	if (!data)
	{
		throw new Error(
			'Producer inputs not found. This hook must be used within a component wrapped by a <ProducerLayout> that provides the producer inputs data via SWR fallback.',
		);
	}

	return {
		inputs: data,
		setInputs,
	};
}
