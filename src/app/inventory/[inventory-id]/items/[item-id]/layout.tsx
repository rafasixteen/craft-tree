import { getItemById, getItemTags } from '@/domain/item';
import { SWRConfig, unstable_serialize } from 'swr';

interface Params
{
	'item-id': string;
}

interface ItemLayoutProps
{
	params: Promise<Params>;
	children: React.ReactNode;
}

export default async function ItemLayout({ params, children }: ItemLayoutProps)
{
	const { 'item-id': itemId } = await params;

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['item', itemId])]: getItemById(itemId),
					[unstable_serialize(['item-tags', itemId])]: getItemTags(itemId),
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
