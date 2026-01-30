import { Node } from '@xyflow/react';
import { RecipeTreeLeafNodeData, RecipeTreeNodeData } from '@/components/item/recipe-tree-v2';

export type RecipeTreeNode = Node<RecipeTreeNodeData> | Node<RecipeTreeLeafNodeData>;
