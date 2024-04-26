import { gql } from '@/__generated__/gql';

export const GET_GENERAL_TEST_QUESTIONS = gql(/* GraphQL */ `
  query GeneralTestQuestions($input: GeneralTestQuestionsInput!, $first: Int, $after: String) {
    generalTestQuestions(input: $input) {
      questions(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          answers {
            id
            title
          }
          title
        }
        totalCount
      }
      errors {
        __typename
        ... on Error {
          message
        }
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
