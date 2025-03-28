import { gql } from 'apollo-server-express';

export const registerTypeDefs = gql`
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
