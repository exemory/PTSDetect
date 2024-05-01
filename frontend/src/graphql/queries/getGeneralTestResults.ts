import { gql } from '@/__generated__/gql';

export const GET_GENERAL_TEST_RESULTS = gql(/* GraphQL */ `
  query GetGeneralTestResults($input: GeneralTestQuestionsInput!) {
    generalTestResults(input: $input) {
      results {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          completionDate
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
