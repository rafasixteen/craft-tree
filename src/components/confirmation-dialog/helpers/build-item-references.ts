import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildItemReferencesParams
{
	producerInputsCount: number;
	producerOutputsCount: number;
}

export function buildItemReferences({
	producerInputsCount,
	producerOutputsCount,
}: BuildItemReferencesParams): ResourceReference[]
{
	// TODO: Add how many nodes in graphs reference this item (as input or output).

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

	return refs;
}
