import { NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from '@/graphql/resolvers';
import { createContext, GraphQLContext } from '@/graphql/context';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';

const typesArray = loadFilesSync(path.join(process.cwd(), 'src/graphql/types/**/*.graphql'), { extensions: ['graphql'] });
export const typeDefs = mergeTypeDefs(typesArray);

const server = new ApolloServer<GraphQLContext>({
	typeDefs,
	resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(server, {
	context: async (req) => createContext(req),
});

export async function GET(req: NextRequest)
{
	return handler(req);
}

export async function POST(req: NextRequest)
{
	return handler(req);
}
