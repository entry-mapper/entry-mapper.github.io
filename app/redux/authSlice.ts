import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoginForm, LoginResponse, LoginSuccessResponse, User } from '../interfaces/auth.interfaces';
import * as loginApi from '../api/auth.api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  errorAlert: boolean;
  alertMessage: string;
  infoAlert: boolean;
  infoMessage: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  errorAlert: false,
  alertMessage: '',
  infoAlert: false,
  infoMessage: '',
};

// helpers
export const setTokenDetailsInlocalStorage = (
  loginSuccessResponse: LoginSuccessResponse,
  now: Date
) => {
  const { user, accessToken, expiresIn } = loginSuccessResponse;

  localStorage.setItem("token", accessToken);
  localStorage.setItem(
      "expiresIn",
      JSON.stringify(now.getTime() + (expiresIn ? expiresIn * 1000 : 0))
  );
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearTokenDetailsFromlocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("user");
};


export const login = createAsyncThunk<LoginResponse, LoginForm, { rejectValue: { message: string; error: string; statusCode: number } }>(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await loginApi.login(formData);
      if ('user' in response) {
        const now = new Date();
        setTokenDetailsInlocalStorage(response, now);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error as { message: string; error: string; statusCode: number });
    }
  }
);

export const checkLogin = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/checkLogin',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const expiresIn = parseInt(localStorage.getItem('expiresIn') || '0', 10);

      if (token && expiresIn && user) {
        const now = new Date();
        if (now.getTime() > expiresIn) {
          clearTokenDetailsFromlocalStorage();
          return null;
        }
        return user;
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to check login status');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearTokenDetailsFromlocalStorage();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        if ('user' in action.payload) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.errorAlert = true;
          state.alertMessage = action.payload.message;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.errorAlert = true;
        state.alertMessage = action.payload?.message || 'Login failed';
      })
      .addCase(checkLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkLogin.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkLogin.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;