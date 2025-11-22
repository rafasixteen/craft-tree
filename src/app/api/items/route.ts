import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { CreateItemSchema, Item } from '@lib/types/item';
import { handleError } from '@/lib/validation/errors/handle-error';
import { ItemsQuerySchema } from '@/lib/cookies/items-query';

export async function GET(req: NextRequest)
{
	try
	{
		const { page, search, limit } = ItemsQuerySchema.parse({
			page: req.nextUrl.searchParams.get('page') ?? undefined,
			search: req.nextUrl.searchParams.get('search') ?? undefined,
			limit: req.nextUrl.searchParams.get('limit') ?? undefined,
		});

		const items: Item[] = await prisma.item.findMany({
			where: {
				name: {
					contains: search,
					mode: 'insensitive',
				},
			},
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { name: 'asc' },
		});

		const totalItems: number = await prisma.item.count({
			where: {
				name: { contains: search, mode: 'insensitive' },
			},
		});

		return NextResponse.json({
			items,
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
		});
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
