'use client';

import { Button } from '@/components/ui/button';
import {
	buildGraphReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { Graph, deleteGraph } from '@/domain/graph';
import { TrashIcon } from 'lucide-react';

interface DeleteGraphDialogProps
{
	graph: Graph;
}

export function DeleteGraphDialog({ graph }: DeleteGraphDialogProps)
{
	const { nodes } = graph.data;

	const itemNodesCount = nodes.filter((node) => node.type === 'item').length;
	const producerNodesCount = nodes.filter((node) => node.type === 'producer').length;
	const splitNodesCount = nodes.filter((node) => node.type === 'split').length;

	const target: DeleteTarget = {
		resourceName: graph.name,
		resourceType: 'graph',
		references: buildGraphReferences({
			itemNodesCount: itemNodesCount,
			producerNodesCount: producerNodesCount,
			splitNodesCount: splitNodesCount,
		}),
	};

	async function onConfirm()
	{
		await deleteGraph({ graphId: graph.id });
	}

	const meta: ResourceMetaInfo = {
		icon: '▦',
		color: '#e8643c',
		description: (name) => `Graph "${name}" stores complex graph data tied to this inventory.`,
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
