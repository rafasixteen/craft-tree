import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildTagReferencesParams
{
	itemsCount: number;
	producersCount: number;
}

export function buildTagReferences({ itemsCount, producersCount }: BuildTagReferencesParams): ResourceReference[]
{
	const refs: ResourceReference[] = [];

	if (itemsCount > 0)
	{
		refs.push({
			type: 'item_tags',
			label: 'Items tagged',
			count: itemsCount,
		});
	}

	if (producersCount > 0)
	{
		refs.push({
			type: 'producer_tags',
			label: 'Producers tagged',
			count: producersCount,
		});
	}

	return refs;
}
