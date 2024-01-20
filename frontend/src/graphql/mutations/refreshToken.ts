import { gql } from '@/__generated__/gql';

export const REFRESH_TOKEN = gql(/* GraphQL */ `
  mutation RefreshToken {
    refreshToken {
      token {
        value
        expirationTime
      }
      errors {
        __typename
        ... on UserNotFoundError {
          message
        }
      }
    }
  }
`);
