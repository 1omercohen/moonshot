import { gql } from "apollo-server-express";

export const typeDefs = gql`
    enum CityEnum {
        TEL_AVIV
        NEW_YORK
        LONDON
        PARIS
        TOKYO
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        birthDate: String!
        city: CityEnum!
        createdAt: String!
        updatedAt: String!
    }

    input CreateUserInput {
        firstName: String!
        lastName: String!
        birthDate: String!
        city: CityEnum!
    }

    input UpdateUserInput {
        firstName: String!
        lastName: String!
        birthDate: String!
        city: CityEnum!
    }

    type Query {
        getUsers: [User!]!
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: ID!, input: UpdateUserInput!): User!
        deleteUser(id: ID!): Boolean!
    }
`;
