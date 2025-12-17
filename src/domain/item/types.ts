export interface Item
{
	id: string;
	name: string;
}

export interface CreateItemInput
{
	name: string;
}

export interface UpdateItemInput
{
	name?: string;
}
