import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export interface GraphQLContext
{
	req: NextRequest;
	prisma: typeof prisma;
}

export async function createContext(req: NextRequest): Promise<GraphQLContext>
{
	return {
		req,
		prisma,
	};
}
