import { gql } from '@/__generated__/gql';

export const REGISTER_USER = gql(/* GraphQL */ `
  mutation RegisterUser($email: String!, $password: String!) {
    registerUser(input: { email: $email, password: $password }) {
      void
      errors {
        ... on ValidationError {
          message
          errorsCount
          errors {
            errorCode
            errorMessage
            propertyName
            placeholders {
              key
              value
            }
          }
        }
        ... on RegistrationFailedError {
          message
          errorsCount
          errors {
            key
            value
          }
        }
        ... on InternalServerError {
          message
        }
      }
    }
  }
`);
