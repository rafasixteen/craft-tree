'use server';

import { Panel, PanelGroup } from '@/components/Panels';
import ItemList from '@/components/Items/ItemList';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';
import * as Tabs from '@radix-ui/react-tabs';
import RecipeTree from '@/components/RecipeTree';
import { cookies } from 'next/headers';

export default async function ItemsPage()
{
	const cookieStore = await cookies();

	const pageCookie = cookieStore.get('page');
	const searchCookie = cookieStore.get('search');

	const flexGrowStyle = {
		flexGrow: 1,
	};

	return (
		<PanelGroup direction="horizontal" className={styles.panelGroup}>
			<Panel size={70}>
				<Tabs.Root style={flexGrowStyle} className={styles.tabs} defaultValue="recipe">
					<Tabs.List>
						<Tabs.Trigger value="recipe">Recipe Tree</Tabs.Trigger>
						<Tabs.Trigger value="recipes">Recipes</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content style={flexGrowStyle} value="recipe">
						<RecipeTree />
					</Tabs.Content>
					<Tabs.Content value="recipes"></Tabs.Content>
				</Tabs.Root>
			</Panel>

			<Panel size={30}>
				<div className={styles.sidebar}>
					{
						/*

					<Pagination />

					<ItemList page={1} pageSize={2} />

					<SearchBar />

						*/
					}
				</div>
			</Panel>
		</PanelGroup>
	);
}
