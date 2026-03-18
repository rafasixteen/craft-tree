'use client';

import {
	getProducerOutputs,
	Producer,
	setProducerOutputs,
} from '@/domain/producer';
import { useCallback } from 'react';
import useSWR from 'swr';

type SetOutputsParams = Omit<
	Parameters<typeof setProducerOutputs>[0],
	'producerId'
>;

export function useProducerOutputs(producerId: Producer['id'])
{
	const swrKey = ['producer-outputs', producerId];
	const fetcher = () => getProducerOutputs(producerId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const setOutputs = useCallback(
		async function setOutputs({ outputs }: SetOutputsParams)
		{
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

	if (!data)
	{
		throw new Error(
			'Producer outputs not found. This hook must be used within a component wrapped by a <ProducerLayout> that provides the producer outputs data via SWR fallback.',
		);
	}

	return {
		outputs: data,
		setOutputs,
	};
}
