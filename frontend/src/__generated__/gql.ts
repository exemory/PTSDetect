/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token {\n        value\n        expirationTime\n      }\n      errors {\n        __typename\n        ... on ValidationError {\n          errorsCount\n          errors {\n            errorCode\n            errorMessage\n            propertyName\n            placeholders {\n              key\n              value\n            }\n          }\n          message\n        }\n        ... on InvalidCredentialsError {\n          message\n        }\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation RefreshToken {\n    refreshToken {\n      token {\n        value\n        expirationTime\n      }\n      errors {\n        __typename\n        ... on UserNotFoundError {\n          message\n        }\n      }\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  mutation RegisterUser($email: String!, $password: String!) {\n    registerUser(input: { email: $email, password: $password }) {\n      void\n      errors {\n        ... on ValidationError {\n          message\n        }\n        ... on RegistrationFailedError {\n          message\n        }\n        ... on InternalServerError {\n          message\n        }\n      }\n    }\n  }\n": types.RegisterUserDocument,
    "\n  query GeneralTestQuestions($input: GeneralTestQuestionsInput!, $first: Int, $after: String) {\n    generalTestQuestions(input: $input) {\n      questions(first: $first, after: $after) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          id\n          answers {\n            id\n            title\n          }\n          title\n        }\n      }\n      errors {\n        __typename\n        ... on Error {\n          message\n        }\n        ... on ValidationError {\n          message\n          errorsCount\n          errors {\n            errorCode\n            errorMessage\n            propertyName\n            placeholders {\n              key\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GeneralTestQuestionsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token {\n        value\n        expirationTime\n      }\n      errors {\n        __typename\n        ... on ValidationError {\n          errorsCount\n          errors {\n            errorCode\n            errorMessage\n            propertyName\n            placeholders {\n              key\n              value\n            }\n          }\n          message\n        }\n        ... on InvalidCredentialsError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token {\n        value\n        expirationTime\n      }\n      errors {\n        __typename\n        ... on ValidationError {\n          errorsCount\n          errors {\n            errorCode\n            errorMessage\n            propertyName\n            placeholders {\n              key\n              value\n            }\n          }\n          message\n        }\n        ... on InvalidCredentialsError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RefreshToken {\n    refreshToken {\n      token {\n        value\n        expirationTime\n      }\n      errors {\n        __typename\n        ... on UserNotFoundError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshToken {\n    refreshToken {\n      token {\n        value\n        expirationTime\n      }\n      errors {\n        __typename\n        ... on UserNotFoundError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RegisterUser($email: String!, $password: String!) {\n    registerUser(input: { email: $email, password: $password }) {\n      void\n      errors {\n        ... on ValidationError {\n          message\n        }\n        ... on RegistrationFailedError {\n          message\n        }\n        ... on InternalServerError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser($email: String!, $password: String!) {\n    registerUser(input: { email: $email, password: $password }) {\n      void\n      errors {\n        ... on ValidationError {\n          message\n        }\n        ... on RegistrationFailedError {\n          message\n        }\n        ... on InternalServerError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GeneralTestQuestions($input: GeneralTestQuestionsInput!, $first: Int, $after: String) {\n    generalTestQuestions(input: $input) {\n      questions(first: $first, after: $after) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          id\n          answers {\n            id\n            title\n          }\n          title\n        }\n      }\n      errors {\n        __typename\n        ... on Error {\n          message\n        }\n        ... on ValidationError {\n          message\n          errorsCount\n          errors {\n            errorCode\n            errorMessage\n            propertyName\n            placeholders {\n              key\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GeneralTestQuestions($input: GeneralTestQuestionsInput!, $first: Int, $after: String) {\n    generalTestQuestions(input: $input) {\n      questions(first: $first, after: $after) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        nodes {\n          id\n          answers {\n            id\n            title\n          }\n          title\n        }\n      }\n      errors {\n        __typename\n        ... on Error {\n          message\n        }\n        ... on ValidationError {\n          message\n          errorsCount\n          errors {\n            errorCode\n            errorMessage\n            propertyName\n            placeholders {\n              key\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;