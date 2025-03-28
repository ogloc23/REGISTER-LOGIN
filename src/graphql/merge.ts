// src/graphql/merge.ts
import { DocumentNode } from 'graphql';
import { IResolvers } from '@graphql-tools/utils';
import { registerTypeDefs } from './schemas/register';
import { registerResolvers } from './resolvers/register';

// Define a stricter resolver type for clarity
interface ResolverMap {
  Query?: Record<string, (parent: any, args: any, context: any, info: any) => any>;
  Mutation?: Record<string, (parent: any, args: any, context: any, info: any) => any>;
  User?: Record<string, (parent: any, args: any, context: any, info: any) => any>;
}

// Merge type definitions
export const typeDefs: DocumentNode[] = [
  registerTypeDefs,
  // Add more schema files here as your project grows
];

// Merge resolvers
export const resolvers: IResolvers = [
  registerResolvers,
  // Add more resolver files here as your project grows
].reduce<ResolverMap>(
  (merged, current) => ({
    ...merged,
    Query: {
      ...merged.Query,
      ...current.Query,
    },
    Mutation: {
      ...merged.Mutation,
      ...current.Mutation,
    },
    User: {
      ...merged.User,
      ...current.User,
    },
  }),
  {} as ResolverMap
) as IResolvers;