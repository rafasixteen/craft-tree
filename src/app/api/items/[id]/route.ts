import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';
import { UpdateItemSchema } from '@/lib/types/item';
import { handleError } from '@/lib/validation/errors/handle-error';
import { NotFoundError } from '@/lib/validation/errors/not-found-error';
import { UuidSchema } from '@/lib/validation/common-schemas';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
	try
	{
		const { id } = await params;
		const parsedId = UuidSchema.parse(id);
		const item = await prisma.item.findUnique({ where: { id: parsedId } });

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

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
	try
	{
		const { id } = await params;
		const parsedId = UuidSchema.parse(id);
		const data = UpdateItemSchema.parse(await _req.json());

		await prisma.item.update({
			where: { id: parsedId },
			data,
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
		await prisma.item.delete({ where: { id: parsedId } });
		return NextResponse.json({ success: true });
	}
	catch (err: any)
	{
		return handleError(err);
	}
}
