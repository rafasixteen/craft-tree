import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildInventoryReferencesParams
{
	itemsCount: number;
	producersCount: number;
	tagsCount: number;
	graphsCount: number;
}

export function buildInventoryReferences({
	itemsCount,
	producersCount,
	tagsCount,
	graphsCount,
}: BuildInventoryReferencesParams): ResourceReference[]
{
	const refs: ResourceReference[] = [];

	if (itemsCount > 0)
	{
		refs.push({
			type: 'items',
			label: 'Items',
			count: itemsCount,
			critical: true,
		});
	}

	if (producersCount > 0)
	{
		refs.push({
			type: 'producers',
			label: 'Producers',
			count: producersCount,
			critical: true,
		});
	}

	if (tagsCount > 0)
	{
		refs.push({
			type: 'tags',
			label: 'Tags',
			count: tagsCount,
			critical: true,
		});
	}

	if (graphsCount > 0)
	{
		refs.push({
			type: 'graphs',
			label: 'Graphs',
			count: graphsCount,
			critical: true,
		});
	}

	return refs;
}
