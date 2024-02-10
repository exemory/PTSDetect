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
    setAccount: (account: { email: string; password: string; repeatPassword: string }) => void;
    personalDetails: {
      firstName: string;
      lastName: string;
      birthdate: string;
    };
    setPersonalDetails: (personalDetails: { firstName: string; lastName: string; birthdate: string }) => void;
    additionalInfo: {
      gender: Sex;
      isMarried: boolean;
    };
    setAdditionalInfo: (additionalInfo: { gender: Sex; isMarried: boolean }) => void;
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
        firstName: '',
        lastName: '',
        birthdate: '',
      },
      setPersonalDetails: (personalDetails) => {
        set((state) => {
          state.signUp.personalDetails = personalDetails;
        });
      },
      additionalInfo: {
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
          state.signUp.personalDetails = { birthdate: '', firstName: '', lastName: '' };
          state.signUp.additionalInfo = { gender: Sex.Male, isMarried: false };
        });
      },
    },
  };
};
