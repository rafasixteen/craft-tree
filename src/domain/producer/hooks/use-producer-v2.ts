'use client';

import { Producer } from '@/domain/producer';
import { useCallback } from 'react';
import * as ProducerServerActions from '@/domain/producer/server';
import useSWR from 'swr';

type UpdateProducerParams = Omit<Parameters<typeof ProducerServerActions.updateProducer>[0], 'id'>;

export function useProducerV2(producerId?: Producer['id'])
{
	const swrKey = producerId ? ['producer', producerId] : null;
	const fetcher = () => (producerId ? ProducerServerActions.getProducerById(producerId) : null);

	const { data: producer, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const updateProducer = useCallback(
		async function updateProducer({ name, time }: UpdateProducerParams)
		{
			if (!producerId)
			{
				throw new Error('Producer ID is required to update producer');
			}

			await mutate(
				async () =>
				{
					return await ProducerServerActions.updateProducer({ id: producerId, name, time });
				},
				{
					optimisticData: (currentData, displayedData) =>
					{
						const current = currentData ?? displayedData;

						if (!current)
						{
							return { id: producerId, name: name ?? '', time: time ?? 0, inventoryId: '' };
						}

						return { ...current, name: name ?? current.name, time: time ?? current.time };
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
