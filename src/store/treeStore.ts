import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node } from '@generated/graphql/types';

interface TreeStore
{
	expandedItems: string[];
	selectedItems: string[];
	setExpandedItems: (ids: string[]) => void;
	setSelectedItems: (ids: string[]) => void;
}

export const useTreeStore = create<TreeStore>()(
	persist(
		(set) => ({
			expandedItems: [],
			selectedItems: [],
			setExpandedItems: (ids) => set({ expandedItems: ids }),
			setSelectedItems: (ids) => set({ selectedItems: ids }),
		}),
		{ name: 'tree-store' },
	),
);
