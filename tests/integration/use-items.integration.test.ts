import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useItems } from '@/domain/item/hooks/use-items';
import { resetMockDb, mockGetInventoryItems, mockCreateItem, mockDeleteItem } from './mock-items-db';

vi.mock('@/domain/item/server', () => ({
	createItem: vi.fn(),
	deleteItem: vi.fn(),
}));
vi.mock('@/domain/inventory', async () =>
{
	const actual = await vi.importActual<any>('@/domain/inventory');
	return {
		...actual,
		getInventoryItems: vi.fn(),
	};
});

describe('useItems integration', () =>
{
	const inventoryId = 'test-inventory';
	let ItemServerActions: typeof import('@/domain/item/server');
	let InventoryDomain: typeof import('@/domain/inventory');

	beforeEach(async () =>
	{
		resetMockDb();
		ItemServerActions = await import('@/domain/item/server');
		InventoryDomain = await import('@/domain/inventory');
		(InventoryDomain.getInventoryItems as any).mockImplementation(mockGetInventoryItems);
		(ItemServerActions.createItem as any).mockImplementation(mockCreateItem);
		(ItemServerActions.deleteItem as any).mockImplementation(mockDeleteItem);
	});

	it('should start with no items', async () =>
	{
		const { result } = renderHook(() => useItems(inventoryId));
		expect(result.current.items).toEqual([]);
	});

	it('should create an item', async () =>
	{
		const { result } = renderHook(() => useItems(inventoryId));
		await act(async () =>
		{
			await result.current.createItem('Sword', 'sword-icon');
		});
		expect(result.current.items.length).toBe(1);
		expect(result.current.items[0].name).toBe('Sword');
	});

	it('should delete an item', async () =>
	{
		const { result } = renderHook(() => useItems(inventoryId));
		// Create item
		await act(async () =>
		{
			await result.current.createItem('Shield', 'shield-icon');
		});
		const itemId = result.current.items[0].id;
		// Delete item
		await act(async () =>
		{
			await result.current.deleteItem(itemId);
		});
		expect(result.current.items).toEqual([]);
	});

	it('should handle multiple creates and deletes', async () =>
	{
		const { result } = renderHook(() => useItems(inventoryId));
		// Create multiple items
		await act(async () =>
		{
			await result.current.createItem('Axe', 'axe-icon');
			await result.current.createItem('Bow', 'bow-icon');
			await result.current.createItem('Potion', 'potion-icon');
		});
		expect(result.current.items.length).toBe(3);
		expect(result.current.items.map((i) => i.name).sort()).toEqual(['Axe', 'Bow', 'Potion']);

		// Delete the middle item (Bow)
		const bow = result.current.items.find((i) => i.name === 'Bow');
		await act(async () =>
		{
			await result.current.deleteItem(bow!.id);
		});
		expect(result.current.items.length).toBe(2);
		expect(result.current.items.map((i) => i.name).sort()).toEqual(['Axe', 'Potion']);

		// Delete all remaining
		await act(async () =>
		{
			for (const item of [...result.current.items])
			{
				await result.current.deleteItem(item.id);
			}
		});
		expect(result.current.items).toEqual([]);
	});

	it('should support interleaved create and delete', async () =>
	{
		const { result } = renderHook(() => useItems(inventoryId));
		// Create one
		await act(async () =>
		{
			await result.current.createItem('Gem', 'gem-icon');
		});
		expect(result.current.items.length).toBe(1);

		// Create another, then delete the first
		const firstId = result.current.items[0].id;
		await act(async () =>
		{
			await result.current.createItem('Coin', 'coin-icon');
			await result.current.deleteItem(firstId);
		});
		expect(result.current.items.length).toBe(1);
		expect(result.current.items[0].name).toBe('Coin');
	});
});
