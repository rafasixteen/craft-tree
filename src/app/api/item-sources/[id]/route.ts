import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { handleError } from '@/lib/validation/errors/handle-error';
import { UuidSchema } from '@/lib/validation/common-schemas';
import { NotFoundError } from '@/lib/validation/errors/not-found-error';
import { UpdateItemSourceSchema } from '@/lib/types/item-sources';
import { IngredientCreate } from '@/lib/types/ingredients';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
	try
	{
		const { id } = await params;
		const parsedId = UuidSchema.parse(id);
		const itemSource = await prisma.itemSource.findUnique({ where: { id: parsedId } });

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

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
	try
	{
		const { id } = await params;
		const parsedId = UuidSchema.parse(id);
		const data = UpdateItemSourceSchema.parse(await _req.json());

		const ingredientData = data.ingredients?.map((ingredient) => ({
			item: { connect: { id: ingredient.itemId } },
			quantity: ingredient.quantity,
		}));

		await prisma.itemSource.update({
			where: { id: parsedId },
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
	try
	{
		const { id } = await params;
		const parsedId = UuidSchema.parse(id);
		await prisma.itemSource.delete({ where: { id: parsedId } });
		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
