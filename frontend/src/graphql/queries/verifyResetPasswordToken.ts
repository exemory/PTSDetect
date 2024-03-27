import { gql } from '@/__generated__/gql';

export const VERIFY_RESET_PASSWORD_TOKEN = gql(/* GraphQL */ `
  query VerifyResetPasswordToken($input: VerifyResetPasswordTokenInput!) {
    verifyResetPasswordToken(input: $input) {
      isVerified
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
      }
    }
  }
`);
