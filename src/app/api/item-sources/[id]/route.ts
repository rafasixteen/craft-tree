import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { handleError } from '@/lib/api/handle-error';
import { Uuid, UuidSchema } from '@/lib/validation/common-schemas';
import { ItemSourceId, ItemSourceIdSchema, UpdateItemSourceSchema } from '@lib/validation/item-source-schemas';
import { NotFoundError } from '@/lib/validation/errors/not-found-error';

export async function GET(_req: NextRequest, { params }: { params: Promise<ItemSourceId> })
{
	try
	{
		const { id } = ItemSourceIdSchema.parse(await params);
		const itemSource = await prisma.itemSource.findUnique({ where: { id } });

		if (itemSource == null)
		{
			throw new NotFoundError('Item source not found');
		}

		return NextResponse.json({ gatheredItemSource: itemSource });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}

export async function PUT(_req: NextRequest, { params }: { params: Promise<ItemSourceId> })
{
	try
	{
		const { id } = ItemSourceIdSchema.parse(await params);
		const data = UpdateItemSourceSchema.parse(await _req.json());

		const ingredientData = data.ingredients?.map((ingredient) => ({
			item: { connect: { id: ingredient.itemId } },
			quantity: ingredient.quantity,
		}));

		await prisma.itemSource.update({
			where: { id },
			data: {
				item: { connect: { id: data.itemId } },
				type: data.type,
				time: data.time,
				ingredients: ingredientData ? { deleteMany: {}, create: ingredientData } : undefined,
			},
		});

		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<ItemSourceId> })
{
	try
	{
		const { id } = ItemSourceIdSchema.parse(await params);
		await prisma.itemSource.delete({ where: { id } });
		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
