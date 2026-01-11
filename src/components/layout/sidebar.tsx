import { Collections } from '@/components/collections';
import { Collection } from '@/domain/collection';
import { ItemTree } from '@/components/items';

interface SidebarProps
{
	collections: Collection[];
	activeCollection: Collection;
}

// Mock data for the tree
const mockItems = [
	{ id: 'item-1', name: 'Wood', slug: 'wood' },
	{ id: 'item-2', name: 'Stone', slug: 'stone' },
	{ id: 'item-3', name: 'Iron Ore', slug: 'iron-ore' },
	{ id: 'item-4', name: 'Gold Ore', slug: 'gold-ore' },
	{ id: 'item-5', name: 'Diamond', slug: 'diamond' },
];

const mockRecipes = [
	{ id: 'recipe-1', name: 'Wooden Plank', slug: 'wooden-plank', itemId: 'item-1' },
	{ id: 'recipe-2', name: 'Wooden Stick', slug: 'wooden-stick', itemId: 'item-1' },
	{ id: 'recipe-3', name: 'Stone Block', slug: 'stone-block', itemId: 'item-2' },
	{ id: 'recipe-4', name: 'Stone Brick', slug: 'stone-brick', itemId: 'item-2' },
	{ id: 'recipe-5', name: 'Iron Ingot', slug: 'iron-ingot', itemId: 'item-3' },
	{ id: 'recipe-6', name: 'Iron Sword', slug: 'iron-sword', itemId: 'item-3' },
	{ id: 'recipe-7', name: 'Gold Ingot', slug: 'gold-ingot', itemId: 'item-4' },
	{ id: 'recipe-8', name: 'Diamond Pickaxe', slug: 'diamond-pickaxe', itemId: 'item-5' },
	{ id: 'recipe-9', name: 'Diamond Sword', slug: 'diamond-sword', itemId: 'item-5' },
];

export function Sidebar({ collections, activeCollection }: SidebarProps)
{
	return (
		<div className="flex flex-col items-center  p-2 gap-2">
			<Collections collections={collections} activeCollection={activeCollection} />
			<ItemTree collectionId={activeCollection.id} collectionName={activeCollection.name} items={mockItems} recipes={mockRecipes} />
		</div>
	);
}
