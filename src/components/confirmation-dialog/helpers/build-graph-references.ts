import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildGraphReferencesParams
{
	itemNodesCount: number;
	producerNodesCount: number;
	splitNodesCount: number;
}

export function buildGraphReferences({
	itemNodesCount,
	producerNodesCount,
	splitNodesCount,
}: BuildGraphReferencesParams): ResourceReference[]
{
	const refs: ResourceReference[] = [];

	if (itemNodesCount > 0)
	{
		refs.push({
			type: 'item_nodes',
			label: 'Item nodes',
			count: itemNodesCount,
			critical: true,
		});
	}

	if (producerNodesCount > 0)
	{
		refs.push({
			type: 'producer_nodes',
			label: 'Producer nodes',
			count: producerNodesCount,
			critical: true,
		});
	}

	if (splitNodesCount > 0)
	{
		refs.push({
			type: 'split_nodes',
			label: 'Split nodes',
			count: splitNodesCount,
			critical: true,
		});
	}

	return refs;
}
