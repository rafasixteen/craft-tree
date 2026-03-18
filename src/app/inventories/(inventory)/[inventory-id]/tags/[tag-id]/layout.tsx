import { getTagById } from '@/domain/tag';

import { SWRConfig, unstable_serialize } from 'swr';

export default async function TagLayout({
	params,
	children,
}: LayoutProps<'/inventories/[inventory-id]/tags/[tag-id]'>)
{
	const { 'tag-id': tagId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['tag', tagId])]: getTagById(tagId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
