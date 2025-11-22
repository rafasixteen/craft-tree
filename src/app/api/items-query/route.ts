import { NextRequest } from 'next/server';
import { saveItemsQueryParams } from '@/lib/cookies/items-query';

export async function POST(req: NextRequest)
{
	const body = await req.json();
	return await saveItemsQueryParams(body);
}
