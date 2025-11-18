import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest) {
	const cursor = request.nextUrl.searchParams.get('cursor');
	const limit = 20;

	const items = await prisma.item.findMany({
		take: limit,
		skip: cursor ? 1 : 0,
		cursor: cursor ? { id: cursor } : undefined,
		orderBy: { createdAt: 'desc' },
	});

	return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
	const { name } = await req.json();
	const item = await prisma.item.create({ data: { name } });
	return NextResponse.json(item, { status: 201 });
}
