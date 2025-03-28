// src/graphql/resolvers/register.ts (unchanged)
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Context } from '../context';

const prisma = new PrismaClient();

interface RegisterArgs {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

export const registerResolvers = {
  Query: {
    me: async (_parent: unknown, _args: Record<string, never>, context: Context) => {
      if (!context.userId) throw new Error('Not authenticated');
      return prisma.user.findUnique({ where: { id: context.userId } });
    },
  },
  Mutation: {
    register: async (_parent: unknown, args: RegisterArgs) => {
      const { firstName, lastName, userName, email, password } = args;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
        },
      });
      return user;
    },
    login: async (_parent: unknown, args: LoginArgs) => {
      const { email, password } = args;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
        { expiresIn: '1d' }
      );
      return { token, user };
    },
  },
  User: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },
};