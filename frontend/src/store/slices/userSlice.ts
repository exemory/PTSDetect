import { Sex } from '@/__generated__/graphql';
import { type ImmerStateCreator } from '../ImmerStateCreator';

interface User {
  __typename?: 'UserInfo';
  id: string;
  email: string;
  personalInfo?: {
    __typename?: 'PersonalInfo';
    firstName?: string | null;
    lastName?: string | null;
    birthdate?: any | null;
    sex?: Sex | null;
    isMarried?: boolean | null;
  } | null;
}

export interface UserSlice {
  user: {
    __typename?: 'UserInfo';
    id: string;
    email: string;
    personalInfo?: {
      __typename?: 'PersonalInfo';
      firstName?: string | null;
      lastName?: string | null;
      birthdate?: any | null;
      sex?: Sex | null;
      isMarried?: boolean | null;
    } | null;
  };
  setUserInfo: (user: User) => void;
  resetUser: () => void;
}

const initialState: User = {
  email: '',
  id: '',
  personalInfo: {
    firstName: '',
    lastName: '',
    birthdate: '',
    sex: Sex.Male,
    isMarried: false,
  },
  __typename: 'UserInfo',
};

export const createUserSlice: ImmerStateCreator<UserSlice> = (set) => {
  return {
    user: {
      ...initialState,
    },
    setUserInfo: (user: User) => {
      set((state) => {
        state.user = user;
      });
    },
    resetUser: () => {
      set((state) => {
        state.user = initialState;
      });
    },
  };
};
