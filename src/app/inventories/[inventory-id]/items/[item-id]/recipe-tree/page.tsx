import { Header } from '@/components/craft-tree-sidebar';
import { RecipeTree } from '@/components/recipe-tree';
import { RecipeTreeProvider } from '@/domain/recipe-tree/hooks';
import { ReactFlowProvider } from '@xyflow/react';
import { cookies } from 'next/headers';
import { SWRConfig, unstable_serialize } from 'swr';
import { getRecipeTreeData } from '@/domain/recipe-tree';

export default async function RecipeTreePage({ params }: PageProps<'/inventories/[inventory-id]/items/[item-id]/recipe-tree'>)
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
