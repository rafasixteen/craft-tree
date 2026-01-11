import { collectionResolvers } from './collections';
import { itemResolvers } from './items';
import { recipeResolvers } from './recipes';

export const resolvers = [collectionResolvers, itemResolvers, recipeResolvers];
