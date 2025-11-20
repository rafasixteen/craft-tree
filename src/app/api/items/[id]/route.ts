import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { ItemId, ItemIdSchema, PatchItemSchema } from '@/lib/validation/item-schemas';
import { handleError } from '@/lib/api/handle-error';
import { NotFoundError } from '@/lib/validation/errors/not-found-error';

export async function GET(_req: NextRequest, { params }: { params: Promise<ItemId> })
{
	try
	{
		const { id } = ItemIdSchema.parse(await params);
		const item = await prisma.item.findUnique({ where: { id } });

		if (item == null)
		{
			throw new NotFoundError('Item not found');
		}

		return NextResponse.json({ item });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<ItemId> })
{
	try
	{
		const { id } = ItemIdSchema.parse(await params);
		const data = PatchItemSchema.parse(await _req.json());

		await prisma.item.update({
			where: { id },
			data,
		});

		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<ItemId> })
{
	try
	{
		const { id } = ItemIdSchema.parse(await params);
		await prisma.item.delete({ where: { id } });
		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
