import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { CreateItemSchema, GetItemsQuery } from '@lib/validation/item-schemas';
import { handleError } from '@lib/api/handle-error';

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

export async function GET(_req: NextRequest, { params }: { params: Promise<GetItemsQuery> })
{
	try
	{
		const { page } = await params;
		const limit = 20;

		const items = await prisma.item.findMany({
			skip: page ? 1 : 0,
			take: limit,
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(items);
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
