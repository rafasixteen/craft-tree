'use client';

import { ProductionGraph } from '@/domain/production-graph';
import { useCallback } from 'react';
import * as ProductionGraphServerActions from '@/domain/production-graph/server';
import useSWR from 'swr';

type UpdateProductionGraphParams = Omit<
	Parameters<typeof ProductionGraphServerActions.updateProductionGraph>[0],
	'id'
>;

export function useProductionGraph(productionGraphId: ProductionGraph['id'])
{
	const swrKey = ['production-graph', productionGraphId];
	const fetcher = () =>
		ProductionGraphServerActions.getProductionGraphById(productionGraphId);

	const { data: productionGraph, mutate } = useSWR(swrKey, fetcher, {
		revalidateOnMount: true,
	});

	if (!productionGraph)
	{
		throw new Error(
			`ProductionGraph with id ${productionGraphId} not found. This hook must be used within a component wrapped by a <ProductionGraphLayout> that provides the productionGraph data via SWR fallback.`,
		);
	}

	const updateProductionGraph = useCallback(
		async function updateProductionGraph({
			name,
			data,
		}: UpdateProductionGraphParams)
		{
			await mutate(
				async () =>
				{
					return await ProductionGraphServerActions.updateProductionGraph(
						{
							id: productionGraph.id,
							name,
							data,
						},
					);
				},
				{
					optimisticData: (current) =>
					{
						if (!current)
						{
							throw new Error(
								'No current production graph data available for optimistic update.',
							);
						}

						return {
							id: current.id,
							data: data ?? current.data,
							inventoryId: current.inventoryId,
							name: name ?? current.name,
						};
					},
					rollbackOnError: true,
					revalidate: true,
				},
			);
		},
		[productionGraph.id, mutate],
	);

	return {
		productionGraph: productionGraph,
		updateProductionGraph,
	};
}
