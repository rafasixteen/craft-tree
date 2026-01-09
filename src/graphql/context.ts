import db from '@/db/client';

export interface GraphQLContext
{
	db: typeof db;
	user?: {
		id: string;
	};
}
