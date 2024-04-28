import { gql } from '@/__generated__/gql';

export const GET_GENERAL_TEST_RESULT = gql(/* GraphQL */ `
  query GetGeneralTestResult($input: GeneralTestResultInput!) {
    generalTestResult(input: $input) {
      result {
        id
        completionDate
        potentialProblems
        adviceLists {
          problem
          advices
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
