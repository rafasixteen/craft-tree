import { Item } from '@/domain/item';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';
import { ProductionRate } from '@/domain/production-graph';

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
	rate: ProductionRate;
	rootNodeId: string;
	nodes: Record<string, RecipeTreeNode>;
}
