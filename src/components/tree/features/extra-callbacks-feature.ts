import { ItemInstance } from '@headless-tree/core';

declare module '@headless-tree/core'
{
	export interface TreeConfig<T>
	{
		// We could use the 'item.getParent()' method, but it returns null for some reason.
		onItemCreated?: (item: ItemInstance<T>, parent: ItemInstance<T>) => Promise<void> | void;
	}
}
