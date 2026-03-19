import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildItemReferencesParams
{
	producerInputsCount: number;
	producerOutputsCount: number;
	itemTagsCount: number;
}

export function buildItemReferences({
	producerInputsCount,
	producerOutputsCount,
	itemTagsCount,
}: BuildItemReferencesParams): ResourceReference[]
{
	const refs: ResourceReference[] = [];

	if (producerInputsCount > 0)
	{
		refs.push({
			type: 'producer_inputs',
			label: 'Producer inputs using this item',
			count: producerInputsCount,
			critical: true,
		});
	}

	if (producerOutputsCount > 0)
	{
		refs.push({
			type: 'producer_outputs',
			label: 'Producer outputs using this item',
			count: producerOutputsCount,
			critical: true,
		});
	}

	if (itemTagsCount > 0)
	{
		refs.push({
			type: 'item_tags',
			label: 'Tag associations',
			count: itemTagsCount,
		});
	}

	return refs;
}
