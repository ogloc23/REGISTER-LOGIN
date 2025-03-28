"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResolvers = void 0;
// src/graphql/resolvers/register.ts (unchanged)
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
exports.registerResolvers = {
    Query: {
        me: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.userId)
                throw new Error('Not authenticated');
            return prisma.user.findUnique({ where: { id: context.userId } });
        }),
    },
    Mutation: {
        register: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { firstName, lastName, userName, email, password } = args;
            const hashedPassword = yield bcrypt.hash(password, 10);
            const user = yield prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    userName,
                    email,
                    password: hashedPassword,
                },
            });
            return user;
        }),
        login: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = args;
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error('User not found');
            const valid = yield bcrypt.compare(password, user.password);
            if (!valid)
                throw new Error('Invalid password');
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'YOUR_SECRET_KEY', { expiresIn: '1d' });
            return { token, user };
        }),
    },
    User: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
};
