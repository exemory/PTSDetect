import { gql } from '@/__generated__/gql';

export const GET_USER_INFO = gql(/* GraphQL */ `
  query GetUserInfo {
    userInfo {
      id
      email
      personalInfo {
        firstName
        lastName
        birthdate
        sex
        isMarried
      }
    }
  }
`);
