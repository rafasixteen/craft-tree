import { Item } from '@/domain/item';
import { Producer, ProducerInput, ProducerOutput } from '@/domain/producer';

export interface RecipeTreeData
{
	items: Item[];
	producers: Producer[];
	producerInputs: ProducerInput[];
	producerOutputs: ProducerOutput[];
}
