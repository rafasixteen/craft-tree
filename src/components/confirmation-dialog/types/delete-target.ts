import { ResourceReference, ResourceType } from '@/components/confirmation-dialog';

export interface DeleteTarget
{
	resourceType: ResourceType;
	resourceName: string;
	references: ResourceReference[];
}
