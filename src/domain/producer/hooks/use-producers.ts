'use client';

import { Inventory, getInventoryProducers } from '@/domain/inventory';
import { Producer, CreateProducerParams, UpdateProducerParams, DeleteProducerParams } from '@/domain/producer';
import { Tag } from '@/domain/tag';
import { useCallback } from 'react';
import * as ProducerServerActions from '@/domain/producer/server';
import useSWR from 'swr';

interface CreateProducer extends Omit<CreateProducerParams, 'inventoryId'>
{
	tagIds?: Tag['id'][];
}

interface UpdateProducer extends UpdateProducerParams
{
	tagIds?: Tag['id'][];
}

export function useProducers(inventoryId: Inventory['id'])
{
	const swrKey = ['inventory-producers', inventoryId];
	const fetcher = () => getInventoryProducers(inventoryId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

	const createProducer = useCallback(
		async function createProducer({ name, time, inputs, outputs, tagIds }: CreateProducer)
		{
			const optimistic: Producer = {
				id: crypto.randomUUID(),
				name,
				time,
				inventoryId: inventoryId,
				inputs: inputs ?? [],
				outputs: outputs ?? [],
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ProducerServerActions.createProducer({ name, time, inventoryId, inputs, outputs });

					if (tagIds && tagIds.length > 0)
					{
						await ProducerServerActions.setProducerTags({ producerId: created.id, tagIds: tagIds });
					}

					return [...current, created];
				},
				{
					optimisticData: (current: Producer[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const updateProducer = useCallback(
		async function updateProducer({ id, name, time, inputs, outputs, tagIds }: UpdateProducer)
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await ProducerServerActions.updateProducer({ id, name, time, inputs, outputs });

					if (tagIds && tagIds.length > 0)
					{
						await ProducerServerActions.setProducerTags({ producerId: id, tagIds });
					}

					return current.map((producer) => (producer.id === id ? { ...producer, ...updated, ...(tagIds ? { tagIds } : {}) } : producer));
				},
				{
					optimisticData: (current: Producer[] = []) =>
						current.map((producer) =>
							producer.id === id
								? {
										...producer,
										...(name ? { name } : {}),
										...(time ? { time } : {}),
										...(inputs ? { inputs } : {}),
										...(outputs ? { outputs } : {}),
										...(tagIds ? { tagIds } : {}),
									}
								: producer,
						),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const deleteProducer = useCallback(
		async function deleteProducer({ producerId }: DeleteProducerParams)
		{
			await mutate(
				async (current = []) =>
				{
					await ProducerServerActions.deleteProducer({ producerId });
					return current.filter((producer) => producer.id !== producerId);
				},
				{
					optimisticData: (current: Producer[] = []) => current.filter((producer) => producer.id !== producerId),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	return {
		producers: data ?? [],
		createProducer,
		updateProducer,
		deleteProducer,
	};
}
