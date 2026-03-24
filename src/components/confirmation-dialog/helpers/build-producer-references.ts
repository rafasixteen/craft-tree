import { ResourceReference } from '@/components/confirmation-dialog';

interface BuildProducerReferencesParams
{
	inputsCount: number;
	outputsCount: number;
}

export function buildProducerReferences({
	inputsCount,
	outputsCount,
}: BuildProducerReferencesParams): ResourceReference[]
{
	// TODO: Add how many nodes in graphs reference this producer.

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

	return refs;
}
