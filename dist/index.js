"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express")); // Changed to default import
const merge_1 = require("./graphql/merge");
const client_1 = require("@prisma/client");
const auth_1 = require("./middleware/auth");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: merge_1.typeDefs,
    resolvers: merge_1.resolvers,
    context: (0, auth_1.createAuthMiddleware)(prisma),
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield server.start();
        server.applyMiddleware({ app });
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            process.stdout.write(`Server running at http://localhost:${PORT}${server.graphqlPath}\n`);
        });
    });
}
startServer().catch((e) => process.stderr.write(`${e}\n`));
