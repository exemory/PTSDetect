import { gql } from '@/__generated__/gql';

export const GET_USER_AVATAR = gql(/* GraphQL */ `
  query GetUserAvatar {
    userAvatar {
      avatarUrl
      errors {
        __typename
        ... on InternalServerError {
          message
        }
        ... on AvatarNotFoundError {
          avatarId
          message
        }
        ... on UserDoesNotHaveAvatarError {
          userId
          message
        }
      }
    }
  }
`);
