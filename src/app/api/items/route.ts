import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { CreateItemSchema } from '@lib/types/item';
import { handleError } from '@/lib/validation/errors/handle-error';
import { z } from 'zod';

export async function GET(req: NextRequest)
{
	try
	{
		const pageParam = req.nextUrl.searchParams.get('page');
		const searchParam = req.nextUrl.searchParams.get('search');

		const GetItemsQuerySchema = z.object({
			page: z.coerce.number().int().nonnegative().default(1),
			search: z.string().max(32).optional(),
		});

		const { page, search } = GetItemsQuerySchema.parse({ page: pageParam, search: searchParam });

		const limit = 1;
		const skip = (page - 1) * limit;

		const items = await prisma.item.findMany({
			where: {
				name: {
					contains: search,
					mode: 'insensitive',
				},
			},
			skip: skip,
			take: limit + 1,
			orderBy: { name: 'asc' },
		});

		return NextResponse.json({ items: items.slice(0, limit), hasNext: items.length > limit });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}

export async function POST(req: NextRequest)
{
	try
	{
		const data = CreateItemSchema.parse(await req.json());
		await prisma.item.create({ data });
		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
