import { gql } from '@/__generated__/gql';

export const GET_GENERAL_TEST_USERS_RESULTS = gql(/* GraphQL */ `
  query GetGeneralTestUsersResults($input: GeneralTestUsersResultsInput!) {
    generalTestUsersResults(input: $input) {
      usersResults {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          userId
          generalTestResults {
            id
            completionDate
          }
        }
        totalCount
      }
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
      }
    }
  }
`);
