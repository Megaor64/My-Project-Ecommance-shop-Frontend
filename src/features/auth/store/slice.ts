import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser } from "@/lib/auth";
import {
  adminLogin,
  adminVerify2fa,
  demoLogin,
  fetchMe,
  googleAuth,
  login,
  logout,
  register,
  verifyEmail,
} from "./thunks";

export type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
};

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setCredentials(
      state,
      action: { payload: { user: AuthUser; token: string | null } }
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: AuthState) => {
      state.status = "loading";
      state.error = null;
    };
    const setFailed = (state: AuthState, message: string) => {
      state.status = "failed";
      state.error = message;
    };

    builder
      .addCase(login.pending, setLoading)
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Login failed");
      })

      .addCase(logout.pending, setLoading)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      })

      .addCase(register.pending, setLoading)
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Registration failed");
      })

      .addCase(verifyEmail.pending, setLoading)
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Verification failed");
      })

      .addCase(adminLogin.pending, setLoading)
      .addCase(adminLogin.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Admin login failed");
      })

      .addCase(adminVerify2fa.pending, setLoading)
      .addCase(adminVerify2fa.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(adminVerify2fa.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Invalid verification code");
      })

      .addCase(googleAuth.pending, setLoading)
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Google sign-in failed");
      })

      .addCase(demoLogin.pending, setLoading)
      .addCase(demoLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(demoLogin.rejected, (state, action) => {
        setFailed(state, action.payload ?? "Demo login failed");
      })

      .addCase(fetchMe.pending, (state) => {
        if (!state.user) {
          state.status = "loading";
        }
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearAuthError, setCredentials, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
