import { SignUpSlice, createSignUpSlice } from '@/store/slices/signUpSlice';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useStore = create<SignUpSlice>()(devtools(immer((...a) => ({ ...createSignUpSlice(...a) }))));
