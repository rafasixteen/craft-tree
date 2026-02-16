import { Producer } from '@/domain/producer';
import { Tag } from '@/domain/tag';

export interface ProducerTag
{
	producerId: Producer['id'];
	tagId: Tag['id'];
}
