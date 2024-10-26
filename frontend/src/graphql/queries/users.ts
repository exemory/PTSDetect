import { gql } from '@/__generated__/gql';

export const GET_USERS = gql(/* GraphQL */ `
  query GetUsers(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $where: UserInfoFilterInput
    $order: [UserInfoSortInput!]
  ) {
    users(first: $first, after: $after, last: $last, before: $before, where: $where, order: $order) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
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
      totalCount
      edges {
        cursor
        node {
          id
          email
        }
      }
    }
  }
`);
