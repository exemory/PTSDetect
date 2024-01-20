import { gql } from '@/__generated__/gql';

export const LOGIN = gql(/* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token {
        value
        expirationTime
      }
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
        ... on InvalidCredentialsError {
          message
        }
      }
    }
  }
`);
