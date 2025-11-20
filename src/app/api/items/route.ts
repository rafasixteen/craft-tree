import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { CreateItemSchema, GetItemsQuerySchema } from '@lib/validation/item-schemas';
import { handleError } from '@/lib/validation/errors/handle-error';

export async function GET(req: NextRequest)
{
	try
	{
		const pageParam = req.nextUrl.searchParams.get('page');
		const { page } = GetItemsQuerySchema.parse({ page: pageParam });

		const limit = 20;

		const items = await prisma.item.findMany({
			skip: page * limit,
			take: limit,
			orderBy: { name: 'asc' },
		});

		return NextResponse.json(items);
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
