import { gql } from '@/__generated__/gql';

export const REGISTER_USER = gql(/* GraphQL */ `
  mutation RegisterUser($email: String!, $password: String!) {
    registerUser(input: { email: $email, password: $password }) {
      void
      errors {
        ... on ValidationError {
          message
        }
        ... on RegistrationFailedError {
          message
        }
        ... on InternalServerError {
          message
        }
      }
    }
  }
`);
