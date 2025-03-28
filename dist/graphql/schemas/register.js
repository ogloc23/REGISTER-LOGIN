"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTypeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.registerTypeDefs = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(
      firstName: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): User!
    login(email: String!, password: String!): AuthPayload!
  }
`;
