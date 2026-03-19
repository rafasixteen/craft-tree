import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildTagReferencesParams
{
	itemTagsCount: number;
	producerTagsCount: number;
}

export function buildTagReferences({
	itemTagsCount,
	producerTagsCount,
}: BuildTagReferencesParams): ResourceReference[]
{
	const refs: ResourceReference[] = [];

	if (itemTagsCount > 0)
	{
		refs.push({
			type: 'item_tags',
			label: 'Items tagged',
			count: itemTagsCount,
		});
	}

	if (producerTagsCount > 0)
	{
		refs.push({
			type: 'producer_tags',
			label: 'Producers tagged',
			count: producerTagsCount,
		});
	}

	return refs;
}
