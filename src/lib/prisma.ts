import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@generated/prisma/client';
import { glob } from 'glob';
import fs from 'fs';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;

async function runTriggers()
{
	const files = glob.sync('prisma/sql/triggers/*.sql');

	for (const file of files)
	{
		const sql = fs.readFileSync(file, 'utf-8');
		await prisma.$executeRawUnsafe(sql);
	}
}

async function main()
{
	try
	{
		await runTriggers();
	}
	catch (error)
	{
		console.error('Error running triggers:', error);
	}
}

main()
	.catch((err) => console.error(err))
	.finally(async () =>
	{
		await prisma.$disconnect();
	});
