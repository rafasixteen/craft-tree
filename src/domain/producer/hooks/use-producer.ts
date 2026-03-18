'use client';

import { Producer } from '@/domain/producer';
import { useCallback } from 'react';
import * as ProducerServerActions from '@/domain/producer/server';
import useSWR from 'swr';

type UpdateProducerParams = Omit<
	Parameters<typeof ProducerServerActions.updateProducer>[0],
	'id'
>;

export function useProducer(producerId: Producer['id'])
{
	const swrKey = ['producer', producerId];
	const fetcher = () => ProducerServerActions.getProducerById(producerId);

	const { data: producer, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	if (!producer)
	{
		throw new Error(
			'Producer not found. This hook must be used within a component wrapped by a <ProducerLayout> that provides the producer data via SWR fallback.',
		);
	}

	const updateProducer = useCallback(
		async function updateProducer({ name, time }: UpdateProducerParams)
		{
			await mutate(
				async () =>
				{
					return await ProducerServerActions.updateProducer({
						id: producerId,
						name,
						time,
					});
				},
				{
					optimisticData: (currentData, displayedData) =>
					{
						const current = currentData ?? displayedData;

						if (!current)
						{
							return {
								id: producerId,
								name: name ?? '',
								time: time ?? 0,
								inventoryId: '',
							};
						}

						return {
							...current,
							name: name ?? current.name,
							time: time ?? current.time,
						};
					},
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[producerId, mutate],
	);

	return {
		producer: producer,
		updateProducer,
	};
}
