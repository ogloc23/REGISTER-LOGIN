// src/index.ts
import { ApolloServer } from 'apollo-server-express';
import express from 'express'; // Changed to default import
import { typeDefs, resolvers } from './graphql/merge';
import { PrismaClient } from '@prisma/client';
import { createAuthMiddleware } from './middleware/auth';

const prisma = new PrismaClient();
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createAuthMiddleware(prisma),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    process.stdout.write(`Server running at http://localhost:${PORT}${server.graphqlPath}\n`);
  });
}

startServer().catch((e) => process.stderr.write(`${e}\n`));