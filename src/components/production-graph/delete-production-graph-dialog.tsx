'use client';

import { Button } from '@/components/ui/button';
import {
	buildProductionGraphReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { ProductionGraph, deleteProductionGraph } from '@/domain/production-graph';
import { TrashIcon } from 'lucide-react';

interface DeleteProductionGraphDialogProps
{
	productionGraph: ProductionGraph;
}

export function DeleteProductionGraphDialog({ productionGraph }: DeleteProductionGraphDialogProps)
{
	const { nodes } = productionGraph.data;

	const itemNodesCount = nodes.filter((node) => node.type === 'item').length;
	const producerNodesCount = nodes.filter((node) => node.type === 'producer').length;
	const splitNodesCount = nodes.filter((node) => node.type === 'split').length;

	const target: DeleteTarget = {
		resourceName: productionGraph.name,
		resourceType: 'production graph',
		references: buildProductionGraphReferences({
			itemNodesCount: itemNodesCount,
			producerNodesCount: producerNodesCount,
			splitNodesCount: splitNodesCount,
		}),
	};

	async function onConfirm()
	{
		await deleteProductionGraph(productionGraph.id);
	}

	const meta: ResourceMetaInfo = {
		icon: '▦',
		color: '#e8643c',
		description: (name) => `Production graph "${name}" stores complex graph data tied to this inventory.`,
		warningThreshold: 1,
	};

	return (
		<DeleteConfirmationDialog
			trigger={
				<Button variant="destructive" size="icon-sm">
					<TrashIcon className="size-3" />
				</Button>
			}
			target={target}
			meta={meta}
			onConfirm={onConfirm}
		/>
	);
}
