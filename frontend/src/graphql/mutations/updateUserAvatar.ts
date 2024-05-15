import { gql } from '@/__generated__/gql';

export const UPDATE_USER_AVATAR = gql(/* GraphQL */ `
  mutation UpdateUserAvatar($input: UpdateUserAvatarInput!) {
    updateUserAvatar(input: $input) {
      avatarUrl
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
        }
        ... on InternalServerError {
          message
        }
        ... on AvatarNotFoundError {
          avatarId
          message
        }
      }
    }
  }
`);
