import { UserSlice, createUserSlice } from '@/store/slices/userSlice';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useStore = create<UserSlice>()(devtools(immer((...a) => ({ ...createUserSlice(...a) }))));
