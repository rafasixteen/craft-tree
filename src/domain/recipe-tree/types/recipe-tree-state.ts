import { Item } from '@/domain/item';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';

export interface RecipeTreeNode
{
	id: string;
	item: Item;
	producers: Producer[];
	selectedProducerId: Producer['id'] | null;
	parentId: string | null;
	children: Record<Producer['id'], string[]>;
	producerInputs: Record<Producer['id'], ProducerInput[]>;
	producerOutputs: Record<Producer['id'], ProducerOutput[]>;
}

export interface RecipeTreeState
{
	rootNodeId: string;
	nodes: Record<string, RecipeTreeNode>;
}
