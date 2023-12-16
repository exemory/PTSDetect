import { Sex } from '@/__generated__/graphql';
import { type ImmerStateCreator } from '../ImmerStateCreator';

export interface SignUpSlice {
  signUp: {
    steps: string[];
    activeStep: number;
    setActiveStep: (activeStep: number) => void;
    account: {
      email: string;
      password: string;
      repeatPassword: string;
    };
    setAccount: (account: { email: string; password: string }) => void;
    personalDetails: {
      username: string;
      firstName: string;
      lastName: string;
    };
    setPersonalDetails: (personalDetails: { username: string; firstName: string; lastName: string }) => void;
    additionalInfo: {
      birthdate: string;
      gender: Sex;
      isMarried: boolean;
    };
    setAdditionalInfo: (additionalInfo: { birthdate: string; gender: string; isMarried: boolean }) => void;
    reset: () => void;
  };
}

export const createSignUpSlice: ImmerStateCreator<SignUpSlice> = (set) => {
  return {
    signUp: {
      steps: ['Account', 'Personal Details', 'Additional'],
      activeStep: 0,
      setActiveStep: (activeStep) =>
        set((state) => {
          state.signUp.activeStep = activeStep;
        }),
      account: {
        email: '',
        password: '',
        repeatPassword: '',
      },
      setAccount: (account) =>
        set((state) => {
          state.signUp.account = account;
        }),
      personalDetails: {
        username: '',
        firstName: '',
        lastName: '',
      },
      setPersonalDetails: (personalDetails) => {
        set((state) => {
          state.signUp.personalDetails = personalDetails;
        });
      },
      additionalInfo: {
        birthdate: '',
        gender: Sex.Male,
        isMarried: false,
      },
      setAdditionalInfo: (additionalInfo) => {
        set((state) => {
          state.signUp.additionalInfo = additionalInfo;
        });
      },
      reset: () => {
        set((state) => {
          state.signUp.activeStep = 0;
          state.signUp.account = { email: '', password: '', repeatPassword: '' };
          state.signUp.personalDetails = { username: '', firstName: '', lastName: '' };
          state.signUp.additionalInfo = { birthdate: '', gender: Sex.Male, isMarried: false };
        });
      },
    },
  };
};
