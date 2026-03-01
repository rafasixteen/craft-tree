import { Item } from '@/domain/item';
import { Producer } from '@/domain/producer';
import { ItemRate } from '@/domain/production-graph';

export interface ProducerNodeData extends Record<string, unknown>
{
	itemId?: Item['id'];
	producerId?: Producer['id'];
	selectedProducerIndex?: number;

	producerCount: number;
	inputRates: ItemRate[] | null;
	outputRates: ItemRate[] | null;

	extraInfo: boolean;
}
