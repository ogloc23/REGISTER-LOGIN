"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const register_1 = require("./schemas/register");
const register_2 = require("./resolvers/register");
// Merge type definitions
exports.typeDefs = [
    register_1.registerTypeDefs,
    // Add more schema files here as your project grows
];
// Merge resolvers
exports.resolvers = [
    register_2.registerResolvers,
    // Add more resolver files here as your project grows
].reduce((merged, current) => (Object.assign(Object.assign({}, merged), { Query: Object.assign(Object.assign({}, merged.Query), current.Query), Mutation: Object.assign(Object.assign({}, merged.Mutation), current.Mutation), User: Object.assign(Object.assign({}, merged.User), current.User) })), {});
