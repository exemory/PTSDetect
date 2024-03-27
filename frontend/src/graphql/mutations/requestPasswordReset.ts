import { gql } from '@/__generated__/gql';

export const REQUEST_PASSWORD_RESET = gql(/* GraphQL */ `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
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
        ... on UserNotFoundError {
          data {
            key
            value
          }
          message
        }
        ... on InternalServerError {
          message
        }
      }
    }
  }
`);
