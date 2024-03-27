import { gql } from '@/__generated__/gql';

export const RESET_PASSWORD = gql(/* GraphQL */ `
  mutation ResetPassword($userId: String!, $token: String!, $newPassword: String!) {
    resetPassword(input: { userId: $userId, token: $token, newPassword: $newPassword }) {
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
        ... on ResetPasswordFailedError {
          message
          errorsCount
        }
      }
    }
  }
`);
