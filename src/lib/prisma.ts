import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@generated/prisma/client';
import { glob } from 'glob';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
	adapter,
});

export default prisma;

async function runFiles(files: string[])
{
	for (const file of files)
	{
		const sql = fs.readFileSync(file, 'utf-8');

		try
		{
			console.log(`Executing file: ${file}`);
			await prisma.$executeRawUnsafe(sql);
		}
		catch (error)
		{
			console.error(`Error executing file ${file}:`, error);
		}
	}
}

async function main()
{
	try
	{
		await runFiles(glob.sync('prisma/sql/functions/**/*.sql'));
		await runFiles(glob.sync('prisma/sql/triggers/**/*.sql'));
	}
	catch (error)
	{
		console.error("Error running sql's:", error);
	}
}

main()
	.catch((err) => console.error(err))
	.finally(async () =>
	{
		await prisma.$disconnect();
	});
