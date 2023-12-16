import { gql } from '@/__generated__/gql';

export const LOGIN = gql(/* GraphQL */ `
  mutation Login($login: String!, $password: String!) {
    login(input: { login: $login, password: $password }) {
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
