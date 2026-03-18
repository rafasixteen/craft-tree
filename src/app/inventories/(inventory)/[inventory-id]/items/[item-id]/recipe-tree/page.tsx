import { Header } from '@/components/sidebar';
import { RecipeTree } from '@/components/recipe-tree';

import { getRecipeTreeData } from '@/domain/recipe-tree';
import { RecipeTreeProvider } from '@/domain/recipe-tree/hooks';

import { cookies } from 'next/headers';
import { ReactFlowProvider } from '@xyflow/react';
import { SWRConfig, unstable_serialize } from 'swr';

export default async function RecipeTreePage({
	params,
}: PageProps<'/inventories/[inventory-id]/items/[item-id]/recipe-tree'>)
{
	const { 'item-id': itemId } = await params;

	const cookieStore = await cookies();
	const themeCookie = cookieStore.get('theme')?.value;

	const initialTheme = themeCookie === 'dark' || themeCookie === 'light' ? themeCookie : 'light';

	return (
		<SWRConfig
			value={{
				fallback: {
					[unstable_serialize(['recipe-tree', itemId])]: getRecipeTreeData(itemId),
				},
			}}
		>
			<Header />
			<ReactFlowProvider>
				<RecipeTreeProvider itemId={itemId}>
					<RecipeTree initialTheme={initialTheme} />
				</RecipeTreeProvider>
			</ReactFlowProvider>
		</SWRConfig>
	);
}
