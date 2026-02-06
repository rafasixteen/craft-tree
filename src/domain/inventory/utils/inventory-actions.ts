import { InventoryTreeState, InventoryTreeNode } from '@/domain/inventory';
import * as InventoryRules from '@/domain/inventory/utils/inventory-rules';
import { produce } from 'immer';

export function addNode(state: InventoryTreeState, parentId: string, newNode: InventoryTreeNode): InventoryTreeState
{
	return produce(state, (draft) =>
	{
		const parent = draft.nodes[parentId];

		if (!parent)
		{
			throw new Error(`Parent node with ID ${parentId} not found`);
		}

		if (!InventoryRules.canAddChild({ parentNode: parent, childNode: newNode }))
		{
			throw new Error(`Cannot add ${newNode.type} under ${parent.type}`);
		}

		// Add to the nodes map
		draft.nodes[newNode.id] = newNode;

		// Ensure parent has children array
		if (!parent.children)
		{
			parent.children = [];
		}

		// Append the new node
		parent.children.push(newNode.id);
	});
}

export function deleteNode(state: InventoryTreeState, nodeId: string): InventoryTreeState
{
	return produce(state, (draft) =>
	{
		function deleteRecursively(id: string)
		{
			const node = draft.nodes[id];

			if (!node)
			{
				return;
			}

			node.children?.forEach(deleteRecursively);
			delete draft.nodes[id];
		}

		// Remove reference from parent
		for (const parent of Object.values(draft.nodes))
		{
			if (parent.children?.includes(nodeId))
			{
				parent.children = parent.children.filter((id) => id !== nodeId);
				break;
			}
		}

		deleteRecursively(nodeId);
	});
}

export function renameNode(state: InventoryTreeState, nodeId: string, newName: string): InventoryTreeState
{
	return produce(state, (draft) =>
	{
		const node = draft.nodes[nodeId];

		if (node)
		{
			node.name = newName;
		}
	});
}

export function setChildren(state: InventoryTreeState, parentId: string, childIds: string[]): InventoryTreeState
{
	return produce(state, (draft) =>
	{
		const parent = draft.nodes[parentId];

		if (!parent)
		{
			throw new Error(`Parent ${parentId} not found`);
		}

		// Validate if children exist
		for (const id of childIds)
		{
			if (!draft.nodes[id])
			{
				throw new Error(`Child ${id} not found`);
			}
		}

		// Enforce rules
		for (const id of childIds)
		{
			const child = draft.nodes[id];

			const canMoveNodeArgs = {
				node: child,
				newParent: parent,
			};

			if (!InventoryRules.canMoveNode(canMoveNodeArgs))
			{
				throw new Error(`Cannot move ${child.type} under ${parent.type}`);
			}
		}

		// Prevent cycles
		for (const id of childIds)
		{
			if (isDescendant(draft.nodes, id, parentId))
			{
				throw new Error('Cannot create a cycle in the tree');
			}
		}

		// Remove children from their old parents
		for (const node of Object.values(draft.nodes))
		{
			if (!node.children)
			{
				continue;
			}

			node.children = node.children.filter((id) => !childIds.includes(id));
		}

		// Assign new children (order preserved).
		parent.children = [...childIds];
	});
}

export function getNodePath(state: InventoryTreeState, nodeId: string): string[]
{
	// Check if node exists
	if (!state.nodes[nodeId])
	{
		return [];
	}

	const path: string[] = [];

	// Helper function to find parent of a node
	function findParent(targetId: string): string | null
	{
		for (const [id, node] of Object.entries(state.nodes))
		{
			if (node.children?.includes(targetId))
			{
				return id;
			}
		}

		return null;
	}

	// Build path from node to root
	let currentId: string | null = nodeId;

	while (currentId !== null)
	{
		const node = state.nodes[currentId];
		path.unshift(node.slug);
		currentId = findParent(currentId);
	}

	return path;
}

function isDescendant(nodes: InventoryTreeState['nodes'], parentId: string, nodeId: string): boolean
{
	const parent = nodes[parentId];

	if (!parent?.children)
	{
		return false;
	}

	for (const childId of parent.children)
	{
		if (childId === nodeId)
		{
			return true;
		}

		if (isDescendant(nodes, childId, nodeId))
		{
			return true;
		}
	}
	return false;
}
