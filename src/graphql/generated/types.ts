import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Collection = {
  __typename?: 'Collection';
  id: Scalars['ID']['output'];
  items?: Maybe<Array<Item>>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type IngredientInput = {
  itemId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type Item = {
  __typename?: 'Item';
  collection?: Maybe<Collection>;
  collectionId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  recipes?: Maybe<Array<Recipe>>;
  slug: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCollection: Collection;
  createItem: Item;
  createRecipe: Recipe;
  deleteCollection: Scalars['Boolean']['output'];
  deleteItem: Scalars['Boolean']['output'];
  deleteRecipe: Scalars['Boolean']['output'];
  updateCollection?: Maybe<Collection>;
  updateItem?: Maybe<Item>;
  updateRecipe?: Maybe<Recipe>;
};


export type MutationCreateCollectionArgs = {
  name: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateItemArgs = {
  collectionId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateRecipeArgs = {
  itemId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  time: Scalars['Int']['input'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateCollectionArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateItemArgs = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateRecipeArgs = {
  id: Scalars['String']['input'];
  ingredients?: InputMaybe<Array<IngredientInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  recipes: Array<Recipe>;
  userCollections: Array<Collection>;
};


export type QueryRecipesArgs = {
  itemId: Scalars['String']['input'];
};


export type QueryUserCollectionsArgs = {
  userId: Scalars['ID']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  id: Scalars['String']['output'];
  item?: Maybe<Item>;
  itemId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  time: Scalars['Int']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Collection: ResolverTypeWrapper<Collection>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IngredientInput: IngredientInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Item: ResolverTypeWrapper<Item>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Recipe: ResolverTypeWrapper<Recipe>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Collection: Collection;
  ID: Scalars['ID']['output'];
  IngredientInput: IngredientInput;
  Int: Scalars['Int']['output'];
  Item: Item;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  Recipe: Recipe;
  String: Scalars['String']['output'];
};

export type CollectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['Item']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = {
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType>;
  collectionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipes?: Resolver<Maybe<Array<ResolversTypes['Recipe']>>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'name' | 'userId'>>;
  createItem?: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationCreateItemArgs, 'collectionId' | 'name'>>;
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'itemId' | 'name' | 'quantity' | 'time'>>;
  deleteCollection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'id'>>;
  deleteItem?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteItemArgs, 'id'>>;
  deleteRecipe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRecipeArgs, 'id'>>;
  updateCollection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'id' | 'name'>>;
  updateItem?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<MutationUpdateItemArgs, 'id' | 'name'>>;
  updateRecipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<MutationUpdateRecipeArgs, 'id'>>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<QueryRecipesArgs, 'itemId'>>;
  userCollections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<QueryUserCollectionsArgs, 'userId'>>;
};

export type RecipeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  item?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType>;
  itemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Collection?: CollectionResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
};

