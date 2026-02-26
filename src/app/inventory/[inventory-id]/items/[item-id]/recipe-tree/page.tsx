import { Header } from '@/components/craft-tree-sidebar';
import { RecipeTree } from '@/components/recipe-tree-v2';
import { RecipeTreeProvider } from '@/domain/recipe-tree-v2/hooks';
import { Item } from '@/domain/item';
import { ReactFlowProvider } from '@xyflow/react';
import { cookies } from 'next/headers';

interface Params
{
	'item-id': Item['id'];
}

interface RecipeTreePageProps
{
	params: Promise<Params>;
}

export default async function RecipeTreePage({ params }: RecipeTreePageProps)
{
	const { 'item-id': itemId } = await params;

	const cookieStore = await cookies();
	const themeCookie = cookieStore.get('theme')?.value;

	const initialTheme = themeCookie === 'dark' || themeCookie === 'light' ? themeCookie : 'light';

	return (
		<>
			<Header />
			<ReactFlowProvider>
				<RecipeTreeProvider itemId={itemId}>
					<RecipeTree initialTheme={initialTheme} />
				</RecipeTreeProvider>
			</ReactFlowProvider>
		</>
	);
}
