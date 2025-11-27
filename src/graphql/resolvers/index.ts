import { itemResolvers } from './item';

export const resolvers = {
	Query: {
		...itemResolvers.Query,
	},
	Mutation: {
		...itemResolvers.Mutation,
	},
	Item: {
		...itemResolvers.Item,
	},
};
