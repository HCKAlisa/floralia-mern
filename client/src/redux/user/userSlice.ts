import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    currentUser: any,
    error: string | null,
    loading: boolean
}

const initialState: CounterState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state: CounterState) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state: CounterState, action: PayloadAction<any>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state: CounterState, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    }
});

export const { signInStart, signInSuccess, signInFailure, signoutSuccess, deleteUserSuccess, deleteUserStart, deleteUserFailure } = userSlice.actions;

export default userSlice.reducer;
