import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	const item = await prisma.item.findUnique({ where: { id: params.id } });
	if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	return NextResponse.json(item);
}

export async function PUT(_req: NextRequest, { params }: { params: { id: string } }) {
	const { name } = await _req.json();
	const updated = await prisma.item.update({ where: { id: params.id }, data: { name } });
	return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	await prisma.item.delete({ where: { id: params.id } });
	return NextResponse.json({ success: true });
}
