import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInventories } from '@/domain/inventory/hooks/use-inventories';
import { resetMockInventoriesDb, mockGetInventories, mockCreateInventory, mockUpdateInventory, mockDeleteInventory } from './mock-inventories-db';

vi.mock('@/domain/inventory/server', () => ({
	createInventory: vi.fn(),
	updateInventory: vi.fn(),
	deleteInventory: vi.fn(),
}));

vi.mock('@/domain/inventory', async () =>
{
	const actual = await vi.importActual<any>('@/domain/inventory');
	return {
		...actual,
		getInventories: vi.fn(),
	};
});

vi.mock('@/domain/user', () => ({
	useUserId: () => ({ userId: 'test-user' }),
}));

describe('useInventories integration', () =>
{
	let InventoryServerActions: typeof import('@/domain/inventory/server');
	let InventoryDomain: typeof import('@/domain/inventory');

	beforeEach(async () =>
	{
		resetMockInventoriesDb();
		InventoryServerActions = await import('@/domain/inventory/server');
		InventoryDomain = await import('@/domain/inventory');
		(InventoryDomain.getInventoriesByUserId as any).mockImplementation(mockGetInventories);
		(InventoryServerActions.createInventory as any).mockImplementation(mockCreateInventory);
		(InventoryServerActions.updateInventory as any).mockImplementation(mockUpdateInventory);
		(InventoryServerActions.deleteInventory as any).mockImplementation(mockDeleteInventory);
	});

	it('should start with no inventories', async () =>
	{
		const { result } = renderHook(() => useInventories());
		expect(result.current.inventories).toEqual([]);
	});

	it('should create an inventory', async () =>
	{
		const { result } = renderHook(() => useInventories());

		await act(async () =>
		{
			await result.current.createInventory('Main');
		});

		expect(result.current.inventories.length).toBe(1);
		expect(result.current.inventories[0].name).toBe('Main');
	});

	it('should update an inventory', async () =>
	{
		const { result } = renderHook(() => useInventories());

		await act(async () =>
		{
			await result.current.createInventory('OldName');
		});

		const invId = result.current.inventories[0].id;

		await act(async () =>
		{
			await result.current.updateInventory(invId, 'NewName');
		});

		expect(result.current.inventories[0].name).toBe('NewName');
	});

	it('should delete an inventory', async () =>
	{
		const { result } = renderHook(() => useInventories());

		await act(async () =>
		{
			await result.current.createInventory('ToDelete');
		});

		const invId = result.current.inventories[0].id;

		await act(async () =>
		{
			await result.current.deleteInventory(invId);
		});

		expect(result.current.inventories).toEqual([]);
	});

	it('should handle multiple creates, updates, and deletes', async () =>
	{
		const { result } = renderHook(() => useInventories());

		// Create multiple
		await act(async () =>
		{
			await result.current.createInventory('A');
			await result.current.createInventory('B');
			await result.current.createInventory('C');
		});

		expect(result.current.inventories.length).toBe(3);

		// Update one
		const b = result.current.inventories.find((i) => i.name === 'B');

		await act(async () =>
		{
			await result.current.updateInventory(b!.id, 'B2');
		});

		expect(result.current.inventories.map((i) => i.name).sort()).toEqual(['A', 'B2', 'C']);

		// Delete all
		await act(async () =>
		{
			for (const inv of [...result.current.inventories])
			{
				await result.current.deleteInventory(inv.id);
			}
		});

		expect(result.current.inventories).toEqual([]);
	});
});
