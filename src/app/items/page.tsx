'use server';

import PanelGroup from '../components/PanelGroup';
import Panel from '../components/Panel';
import styles from './page.module.css';
import Pagination from './_components/Pagination';
import ItemsList from './_components/ItemsList';
import SearchBar from './_components/SearchBar';
import { readItemsQueryParams } from '@/lib/cookies/items-query';
import { getItems } from '@/lib/api/items';
import RecipeTree from './_components/RecipeTree';

export default async function ItemsPage()
{
	const { page, limit, search } = await readItemsQueryParams();
	const { items, totalItems, totalPages } = await getItems({ page, search, limit });

	return (
		<PanelGroup direction="horizontal" className={styles.panelGroup}>
			<Panel size={70}>
				<div className={styles['tree-view']}>
					<RecipeTree />
				</div>
			</Panel>
			<Panel size={30}>
				<div className={styles.sidebar}>
					<Pagination page={page} />

					<ItemsList items={items} />

					<SearchBar defaultValue={search} />
				</div>
			</Panel>
		</PanelGroup>
	);
}
