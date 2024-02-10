import { gql } from '@/__generated__/gql';

export const REGISTER_USER = gql(/* GraphQL */ `
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      void
      errors {
        ... on ValidationError {
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
          message
        }
        ... on RegistrationFailedError {
          errorsCount
          errors {
            code
            message
          }
          message
        }
      }
    }
  }
`);
