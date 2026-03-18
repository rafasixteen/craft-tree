'use client';

import { Producer } from '@/domain/producer';
import * as ProducerServerActions from '@/domain/producer/server';

import useSWR from 'swr';
import { useCallback } from 'react';

type UseProducersParams = Parameters<typeof ProducerServerActions.getProducers>[0];

type CreateProducerParams = Omit<Parameters<typeof ProducerServerActions.createProducer>[0], 'inventoryId'>;

type UpdateProducerParams = Parameters<typeof ProducerServerActions.updateProducer>[0];

type DeleteProducerParams = Parameters<typeof ProducerServerActions.deleteProducer>[0];

export function useProducers({ inventoryId, options }: UseProducersParams)
{
	const swrKey = options ? ['inventory-producers', inventoryId, options] : ['inventory-producers', inventoryId];
	const fetcher = () => ProducerServerActions.getProducers({ inventoryId });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const createProducer = useCallback(
		async function createProducer({ name, time }: CreateProducerParams)
		{
			const optimistic: Producer = {
				id: crypto.randomUUID(),
				name,
				time,
				inventoryId: inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ProducerServerActions.createProducer({
						name,
						time,
						inventoryId,
					});
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
		async function updateProducer({ id, name, time }: UpdateProducerParams)
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await ProducerServerActions.updateProducer({
						id,
						name,
						time,
					});
					return current.map((producer) => (producer.id === id ? { ...producer, ...updated } : producer));
				},
				{
					optimisticData: (current: Producer[] = []) =>
						current.map((producer) =>
							producer.id === id
								? {
										...producer,
										name: name ?? producer.name,
										time: time ?? producer.time,
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
		async function deleteProducer(id: DeleteProducerParams)
		{
			await mutate(
				async (current = []) =>
				{
					await ProducerServerActions.deleteProducer(id);
					return current.filter((producer) => producer.id !== id);
				},
				{
					optimisticData: (current: Producer[] = []) => current.filter((producer) => producer.id !== id),
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
