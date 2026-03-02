'use client';

import { getProductionGraphs, ProductionGraph } from '@/domain/production-graph';
import { useCallback } from 'react';
import useSWR from 'swr';
import * as ProductionGraphServerActions from '@/domain/production-graph/server';

type UseProductionGraphsParams = Parameters<typeof getProductionGraphs>[0];

type CreateProductionGraphParams = Omit<Parameters<typeof ProductionGraphServerActions.createProductionGraph>[0], 'inventoryId'>;

type UpdateProductionGraphParams = Parameters<typeof ProductionGraphServerActions.updateProductionGraph>[0];

type DeleteProductionGraphsParams = Parameters<typeof ProductionGraphServerActions.deleteProductionGraph>[0];

export function useProductionGraphs({ inventoryId }: UseProductionGraphsParams)
{
	const swrKey = ['inventory-production-graphs', inventoryId];
	const fetcher = () => getProductionGraphs({ inventoryId });

	const { data, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	const createProductionGraph = useCallback(
		async function createProductionGraph({ name }: CreateProductionGraphParams)
		{
			const optimistic: ProductionGraph = {
				id: crypto.randomUUID(),
				name,
				data: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
				inventoryId,
			};

			await mutate(
				async (current = []) =>
				{
					const created = await ProductionGraphServerActions.createProductionGraph({
						name,
						inventoryId,
					});

					return [...current, created];
				},
				{
					optimisticData: (current: ProductionGraph[] = []) => [...current, optimistic],
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[inventoryId, mutate],
	);

	const updateProductionGraph = useCallback(
		async function updateProductionGraph({ id, name, data }: UpdateProductionGraphParams)
		{
			await mutate(
				async (current = []) =>
				{
					const updated = await ProductionGraphServerActions.updateProductionGraph({
						id: id,
						name: name,
						data: data,
					});

					return current.map((inventory) => (inventory.id === id ? updated : inventory));
				},
				{
					optimisticData: (current: ProductionGraph[] = []) =>
					{
						return current.map((graph) =>
						{
							if (graph.id !== id)
							{
								return graph;
							}

							return {
								...graph,
								name: name ?? graph.name,
								data: data ?? graph.data,
							};
						});
					},
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[mutate],
	);

	const deleteProductionGraph = useCallback(
		async function deleteProductionGraph(id: DeleteProductionGraphsParams)
		{
			await mutate(
				async (current = []) =>
				{
					await ProductionGraphServerActions.deleteProductionGraph(id);
					return current.filter((inv) => inv.id !== id);
				},
				{
					optimisticData: (current: ProductionGraph[] = []) => current.filter((inv) => inv.id !== id),
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[mutate],
	);

	return {
		productionGraphs: data ?? [],
		createProductionGraph,
		updateProductionGraph,
		deleteProductionGraph,
	};
}
