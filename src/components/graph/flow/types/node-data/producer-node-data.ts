import { Item } from '@/domain/item';
import { Producer } from '@/domain/producer';
import { ItemRate } from '@/domain/graph';

export interface ProducerNodeData extends Record<string, unknown>
{
	itemId: Item['id'] | null;
	producerId: Producer['id'] | null;

	producerCount: number;
	inputRates: ItemRate[] | null;
	outputRates: ItemRate[] | null;
}
