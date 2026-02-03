import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Define types for state
interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    // Add other user properties as needed
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isEmailConfirmed: boolean;
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token') || sessionStorage.getItem('token'),
    isAuthenticated: !!(localStorage.getItem('token') || sessionStorage.getItem('token')),
    isLoading: false,
    error: null,
    isEmailConfirmed: false,
};

// Async Thunks
export const login = createAsyncThunk(
    '/login',
    async ({ credentials }: { credentials: any; remember: boolean }, { rejectWithValue }) => {
        try {
            const response = await api.post('/login', credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    '/register',
    async ({ userData }: { userData: any; remember: boolean }, { rejectWithValue }) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk('/logout', async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
});

export const forgotPassword = createAsyncThunk(
    '/forgot-password',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/forgot-password', { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
        }
    }
);

export const resetPassword = createAsyncThunk(
    '/reset-password',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/reset-password', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;

                if (action.meta.arg.remember) {
                    localStorage.setItem('token', action.payload.token);
                } else {
                    sessionStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true; // Auto-login after register
                state.user = action.payload.user;
                state.token = action.payload.token;

                if (action.meta.arg.remember) {
                    localStorage.setItem('token', action.payload.token);
                } else {
                    sessionStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
