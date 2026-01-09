import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { resolvers } from '@/graphql/resolvers';
import { createContext } from '@/graphql/context';
import type { GraphQLContext } from '@/graphql/context';

const typeDefs = loadSchemaSync('src/graphql/schema/**/*.{gql,graphql}', {
	loaders: [new GraphQLFileLoader()],
});

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const yoga = createYoga<GraphQLContext>({
	schema,
	context: createContext,
});

export const GET = yoga;
export const POST = yoga;
export const runtime = 'nodejs';
