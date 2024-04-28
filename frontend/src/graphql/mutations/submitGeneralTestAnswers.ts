import { gql } from '@/__generated__/gql';

export const SUBMIT_GENERAL_TEST_ANSWERS = gql(/* GraphQL */ `
  mutation SubmitGeneralTestAnswers($input: SubmitGeneralTestAnswersInput!) {
    submitGeneralTestAnswers(input: $input) {
      resultId
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
        ... on AnswersCountMismatchError {
          providedAnswersCount
          testQuestionsCount
          message
        }
        ... on AnswerNotProvidedError {
          questionId
          message
        }
        ... on AnswerMismatchError {
          questionId
          answerId
          message
        }
      }
    }
  }
`);
