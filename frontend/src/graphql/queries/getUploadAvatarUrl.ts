import { gql } from '@/__generated__/gql';

export const GET_UPLOAD_AVATAR_URL = gql(/* GraphQL */ `
  query GetUploadAvatarUrl {
    uploadAvatarUrl {
      avatarId
      uploadUrl
    }
  }
`);
