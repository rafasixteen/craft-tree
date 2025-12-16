import { NodeType } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { Item as PrismaItem, Recipe as PrismaRecipe, Ingredient as PrismaIngredient, Node as PrismaNode } from '@prisma/client';
import { GraphQLContext } from '@/graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateItemInput = {
  name: Scalars['String']['input'];
};

export type CreateNodeInput = {
  itemId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  recipeId?: InputMaybe<Scalars['ID']['input']>;
  type: NodeType;
};

export type CreateRecipeInput = {
  itemId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  time: Scalars['Float']['input'];
};

export type Ingredient = {
  __typename?: 'Ingredient';
  id: Scalars['ID']['output'];
  item: Item;
  quantity: Scalars['Int']['output'];
};

export type IngredientInput = {
  itemId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipes: Array<Recipe>;
  slug: Scalars['String']['output'];
  usedIn: Array<Ingredient>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createItem: Item;
  createNode: Node;
  createRecipe: Recipe;
  deleteItem: Item;
  deleteNode: Node;
  deleteRecipe: Recipe;
  updateItem: Item;
  updateNode: Node;
  updateRecipe: Recipe;
};


export type MutationCreateItemArgs = {
  data: CreateItemInput;
};


export type MutationCreateNodeArgs = {
  data: CreateNodeInput;
};


export type MutationCreateRecipeArgs = {
  data: CreateRecipeInput;
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNodeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateItemArgs = {
  data: UpdateItemInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateNodeArgs = {
  data: UpdateNodeInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateRecipeArgs = {
  data: UpdateRecipeInput;
  id: Scalars['ID']['input'];
};

export type Node = {
  __typename?: 'Node';
  children: Array<Node>;
  id: Scalars['ID']['output'];
  item?: Maybe<Item>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  parent?: Maybe<Node>;
  recipe?: Maybe<Recipe>;
  type: NodeType;
};

export { NodeType };

export type Query = {
  __typename?: 'Query';
  descendantNodes: Array<Node>;
  itemById?: Maybe<Item>;
  itemBySlug?: Maybe<Item>;
  node?: Maybe<Node>;
  nodes: Array<Node>;
  recipeById?: Maybe<Recipe>;
  recipeBySlug?: Maybe<Recipe>;
  rootNodes: Array<Node>;
};


export type QueryDescendantNodesArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecipeByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecipeBySlugArgs = {
  slug: Scalars['String']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  id: Scalars['ID']['output'];
  ingredients: Array<Ingredient>;
  item: Item;
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  time: Scalars['Float']['output'];
};

export type UpdateItemInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNodeInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateRecipeInput = {
  ingredients?: InputMaybe<Array<IngredientInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['Float']['input']>;
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
  CreateItemInput: CreateItemInput;
  CreateNodeInput: CreateNodeInput;
  CreateRecipeInput: CreateRecipeInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Ingredient: ResolverTypeWrapper<PrismaIngredient>;
  IngredientInput: IngredientInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Item: ResolverTypeWrapper<PrismaItem>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Node: ResolverTypeWrapper<PrismaNode>;
  NodeType: NodeType;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Recipe: ResolverTypeWrapper<PrismaRecipe>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateItemInput: UpdateItemInput;
  UpdateNodeInput: UpdateNodeInput;
  UpdateRecipeInput: UpdateRecipeInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateItemInput: CreateItemInput;
  CreateNodeInput: CreateNodeInput;
  CreateRecipeInput: CreateRecipeInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Ingredient: PrismaIngredient;
  IngredientInput: IngredientInput;
  Int: Scalars['Int']['output'];
  Item: PrismaItem;
  Mutation: Record<PropertyKey, never>;
  Node: PrismaNode;
  Query: Record<PropertyKey, never>;
  Recipe: PrismaRecipe;
  String: Scalars['String']['output'];
  UpdateItemInput: UpdateItemInput;
  UpdateNodeInput: UpdateNodeInput;
  UpdateRecipeInput: UpdateRecipeInput;
};

export type IngredientResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['Item'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedIn?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createItem?: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationCreateItemArgs, 'data'>>;
  createNode?: Resolver<ResolversTypes['Node'], ParentType, ContextType, RequireFields<MutationCreateNodeArgs, 'data'>>;
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'data'>>;
  deleteItem?: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationDeleteItemArgs, 'id'>>;
  deleteNode?: Resolver<ResolversTypes['Node'], ParentType, ContextType, RequireFields<MutationDeleteNodeArgs, 'id'>>;
  deleteRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationDeleteRecipeArgs, 'id'>>;
  updateItem?: Resolver<ResolversTypes['Item'], ParentType, ContextType, RequireFields<MutationUpdateItemArgs, 'data' | 'id'>>;
  updateNode?: Resolver<ResolversTypes['Node'], ParentType, ContextType, RequireFields<MutationUpdateNodeArgs, 'data' | 'id'>>;
  updateRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationUpdateRecipeArgs, 'data' | 'id'>>;
};

export type NodeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  children?: Resolver<Array<ResolversTypes['Node']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  item?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>;
};

export type NodeTypeResolvers = EnumResolverSignature<{ folder?: any, item?: any, recipe?: any }, ResolversTypes['NodeType']>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  descendantNodes?: Resolver<Array<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryDescendantNodesArgs, 'id'>>;
  itemById?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemByIdArgs, 'id'>>;
  itemBySlug?: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryItemBySlugArgs, 'slug'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  nodes?: Resolver<Array<ResolversTypes['Node']>, ParentType, ContextType>;
  recipeById?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<QueryRecipeByIdArgs, 'id'>>;
  recipeBySlug?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<QueryRecipeBySlugArgs, 'slug'>>;
  rootNodes?: Resolver<Array<ResolversTypes['Node']>, ParentType, ContextType>;
};

export type RecipeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredients?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType>;
  item?: Resolver<ResolversTypes['Item'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Ingredient?: IngredientResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NodeType?: NodeTypeResolvers;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
};

