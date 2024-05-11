import { gql } from '@/__generated__/gql';

export const UPDATE_USER_INFO = gql(/* GraphQL */ `
  mutation UpdateUserInfo($input: UpdateUserInfoInput!) {
    updateUserInfo(input: $input) {
      personalInfo {
        firstName
        lastName
        birthdate
        sex
        isMarried
      }
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
        ... on InternalServerError {
          message
        }
      }
    }
  }
`);
