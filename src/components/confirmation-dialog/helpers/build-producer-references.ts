import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildProducerReferencesParams
{
	inputsCount: number;
	outputsCount: number;
	tagsCount: number;
}

export function buildProducerReferences({
	inputsCount,
	outputsCount,
	tagsCount,
}: BuildProducerReferencesParams): ResourceReference[]
{
	const refs: ResourceReference[] = [];

	if (inputsCount > 0)
	{
		refs.push({
			type: 'producer_inputs',
			label: 'Input slots',
			count: inputsCount,
			critical: true,
		});
	}

	if (outputsCount > 0)
	{
		refs.push({
			type: 'producer_outputs',
			label: 'Output slots',
			count: outputsCount,
			critical: true,
		});
	}

	if (tagsCount > 0)
	{
		refs.push({
			type: 'producer_tags',
			label: 'Tag associations',
			count: tagsCount,
		});
	}

	return refs;
}
