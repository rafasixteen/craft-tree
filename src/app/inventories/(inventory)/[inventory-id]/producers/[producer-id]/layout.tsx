import { getProducerById, getProducerInputs, getProducerOutputs, getProducerTags } from '@/domain/producer';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function ProducerLayout({ params, children }: LayoutProps<'/inventories/[inventory-id]/producers/[producer-id]'>)
{
	const { 'producer-id': producerId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['producer', producerId])]: getProducerById(producerId),
					[unstable_serialize(['producer-inputs', producerId])]: getProducerInputs(producerId),
					[unstable_serialize(['producer-outputs', producerId])]: getProducerOutputs(producerId),
					[unstable_serialize(['producer-tags', producerId])]: getProducerTags(producerId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
