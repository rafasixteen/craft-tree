'use client';

import { Inventory, getInventoryProducers } from '@/domain/inventory';
import { Producer } from '@/domain/producer';
import { Tag } from '@/domain/tag';
import { useCallback } from 'react';
import * as ProducerServerActions from '@/domain/producer/server';
import useSWR from 'swr';

interface CreateProducerParams
{
	name: Producer['name'];
	time: Producer['time'];
	inputs?: Producer['inputs'];
	outputs?: Producer['outputs'];
	tagIds?: Tag['id'][];
}

interface UpdateProducerParams
{
	producerId: Producer['id'];
	name?: Producer['name'];
	time?: Producer['time'];
	inputs?: Producer['inputs'];
	outputs?: Producer['outputs'];
	tagIds?: Tag['id'][];
}

interface DeleteProducerParams
{
	producerId: Producer['id'];
}

export function useProducers(inventoryId: Inventory['id'])
{
	const swrKey = ['inventory-producers', inventoryId];
	const fetcher = () => getInventoryProducers(inventoryId);

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: false,
	});

	const createProducer = useCallback(
		async function createProducer({ name, icon, tagIds }: CreateProducerParams)
		{
			const optimistic: Producer = {
				id: crypto.randomUUID(),
				name,
				icon,
				inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ProducerServerActions.createProducer({ name, icon, inventoryId });

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
		async function updateProducer({ producerId, name, icon, tagIds }: UpdateProducerParams)
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await ProducerServerActions.updateProducer({ producerId, name, icon });

					if (tagIds)
					{
						await ProducerServerActions.setProducerTags({ producerId, tagIds });
					}

					return current.map((producer) => (producer.id === producerId ? { ...producer, ...updated, ...(tagIds ? { tagIds } : {}) } : producer));
				},
				{
					optimisticData: (current: Producer[] = []) =>
						current.map((producer) =>
							producer.id === producerId ? { ...producer, ...(name ? { name } : {}), ...(icon ? { icon } : {}), ...(tagIds ? { tagIds } : {}) } : producer,
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
