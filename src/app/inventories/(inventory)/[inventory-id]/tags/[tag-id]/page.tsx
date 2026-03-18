'use client';

import { Header } from '@/components/sidebar';
import { useTag } from '@/domain/tag';
import { useParams } from 'next/navigation';

export default function TagPage()
{
	const params = useParams();
	const tagId = params['tag-id'] as string;

	const { tag } = useTag(tagId);

	return (
		<>
			<Header />
			<div className="mx-auto max-w-3xl px-6 py-8">
				<section className="mb-8">
					<h2 className="mb-2 text-xl font-semibold">Tag</h2>
					<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						{JSON.stringify(tag, null, 2)}
					</pre>
				</section>
			</div>
		</>
	);
}
