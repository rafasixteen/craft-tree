import { getItemById, getItemTags } from '@/domain/item';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function ItemLayout({
	params,
	children,
}: LayoutProps<'/inventories/[inventory-id]/items/[item-id]'>)
{
	const { 'item-id': itemId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['item', itemId])]: getItemById(itemId),
					[unstable_serialize(['item-tags', itemId])]:
						getItemTags(itemId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
