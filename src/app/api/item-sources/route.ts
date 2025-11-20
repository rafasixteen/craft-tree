import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { handleError } from '@/lib/validation/errors/handle-error';
import { CreateItemSourceSchema } from '@/lib/validation/item-source-schemas';
import { NotFoundError } from '@lib/validation/errors/not-found-error';

export async function POST(req: NextRequest)
{
	try
	{
		const data = CreateItemSourceSchema.parse(await req.json());

		const item = await prisma.item.findUnique({
			where: { id: data.itemId },
		});

		if (item == null)
		{
			throw new NotFoundError('Item not found');
		}

		const ingredientData = data.ingredients?.map((ingredient) => ({
			item: { connect: { id: ingredient.itemId } },
			quantity: ingredient.quantity,
		}));

		await prisma.itemSource.create({
			data: {
				item: { connect: { id: data.itemId } },
				type: data.type,
				time: data.time,
				ingredients: ingredientData ? { create: ingredientData } : undefined,
			},
		});

		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
