import * as jwt from 'jsonwebtoken';
import { Context } from '../graphql/context';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

export const createAuthMiddleware = (prisma: PrismaClient) => {
  return ({ req }: { req: Request }): Context => {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';

    const getUser = (token: string) => {
      try {
        if (token) {
          return jwt.verify(
            token,
            process.env.JWT_SECRET || 'YOUR_SECRET_KEY'
          ) as { userId: string };
        }
        return null;
      } catch {
        return null;
      }
    };

    const user = getUser(token);

    return {
      prisma,
      userId: user?.userId,
    };
  };
};
