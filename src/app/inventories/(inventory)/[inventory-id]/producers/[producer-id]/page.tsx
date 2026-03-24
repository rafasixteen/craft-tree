'use client';

import { Header } from '@/components/sidebar';

import { useTags } from '@/domain/inventory';
import { useProducer, useProducerInputs, useProducerOutputs, useProducerTags } from '@/domain/producer';

import { useParams } from 'next/navigation';

export default function ProducerPage()
{
	// TODO: Add loading and validating states.

	const params = useParams();
	const producerId = params['producer-id'] as string;

	const { producer } = useProducer({ producerId });
	const { inputs } = useProducerInputs({ producerId });
	const { outputs } = useProducerOutputs({ producerId });

	const { tags: producerTags } = useProducerTags({ producerId });
	const { tags: inventoryTags } = useTags({ inventoryId: producer?.inventoryId });

	const tags = producerTags?.map((tag) => inventoryTags?.find((t) => t.id === tag.tagId));

	return (
		<>
			<Header />
			<div className="mx-auto max-w-3xl px-6 py-8">
				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Producer</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(producer, null, 2)}
					</pre>
				</section>

				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Producer Inputs</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(inputs, null, 2)}
					</pre>
				</section>

				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Producer Outputs</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(outputs, null, 2)}
					</pre>
				</section>

				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Producer Tags</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(tags, null, 2)}
					</pre>
				</section>
			</div>
		</>
	);
}
