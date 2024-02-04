import { gql } from '@/__generated__/gql';

export const GET_GENERAL_TEST_QUESTIONS = gql(/* GraphQL */ `
  query GeneralTestQuestions($input: GeneralTestQuestionsInput!) {
    generalTestQuestions(input: $input) {
      questions {
        nodes {
          id
          answers {
            id
            title
          }
          title
        }
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
