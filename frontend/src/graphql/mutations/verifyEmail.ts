import { gql } from '@/__generated__/gql';

export const VERIFY_EMAIL = gql(/* GraphQL */ `
  mutation VerifyEmail($userId: String!, $token: String!) {
    verifyEmail(input: { userId: $userId, token: $token }) {
      void
      errors {
        __typename
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
        ... on UserNotFoundError {
          data {
            key
            value
          }
          message
        }
        ... on EmailVerificationFailedError {
          errorsCount
          errors {
            key
            value
          }
          message
        }
      }
    }
  }
`);
