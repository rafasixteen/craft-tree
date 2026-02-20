import { Producer } from '@/domain';

export interface ProducerNodeData extends Record<string, unknown>
{
	producer: Producer | null;
}
