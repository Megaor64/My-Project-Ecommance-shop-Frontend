import { createSlice } from "@reduxjs/toolkit";
import {
  adminVerify2fa,
  demoLogin,
  fetchMe,
  googleAuth,
  login,
  logout,
} from "@/features/auth/store/thunks";
import { clearCredentials } from "@/features/auth/store/slice";
import type { AdminUser, UserSettings } from "@/features/settings/types";
import {
  deleteAccount,
  fetchAllUsers,
  fetchSettings,
  updateAppearance,
  updateNotifications,
  updatePermissions,
  updateUserRole,
} from "./thunks";

export type SettingsStatus = "idle" | "loading" | "succeeded" | "failed";

export type SettingsState = {
  settings: UserSettings | null;
  status: SettingsStatus;
  saveStatus: SettingsStatus;
  error: string | null;
  adminUsers: AdminUser[];
  adminUsersStatus: SettingsStatus;
};

export const initialSettingsState: SettingsState = {
  settings: null,
  status: "idle",
  saveStatus: "idle",
  error: null,
  adminUsers: [],
  adminUsersStatus: "idle",
};

function resetSettings(state: SettingsState) {
  state.settings = null;
  state.status = "idle";
  state.saveStatus = "idle";
  state.error = null;
  state.adminUsers = [];
  state.adminUsersStatus = "idle";
}

function resetIfOtherUser(state: SettingsState, userId: string) {
  if (state.settings && String(state.settings.userId) !== String(userId)) {
    resetSettings(state);
  }
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    clearSettingsError(state) {
      state.error = null;
    },
    hydrateSettings(state, action: { payload: UserSettings }) {
      state.settings = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load settings";
      })

      .addCase(updateAppearance.pending, (state) => {
        state.saveStatus = "loading";
        state.error = null;
      })
      .addCase(updateAppearance.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.saveStatus = "succeeded";
      })
      .addCase(updateAppearance.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.payload ?? "Failed to update appearance";
      })

      .addCase(updateNotifications.pending, (state) => {
        state.saveStatus = "loading";
        state.error = null;
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.saveStatus = "succeeded";
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.payload ?? "Failed to update notifications";
      })

      .addCase(deleteAccount.fulfilled, resetSettings)

      // Do not leak one account's settings to the next one in this browser.
      .addCase(logout.fulfilled, resetSettings)
      .addCase(logout.rejected, resetSettings)
      .addCase(clearCredentials, resetSettings)
      .addCase(fetchMe.rejected, resetSettings)
      .addCase(login.fulfilled, (state, action) =>
        resetIfOtherUser(state, action.payload.user.id)
      )
      .addCase(adminVerify2fa.fulfilled, (state, action) =>
        resetIfOtherUser(state, action.payload.user.id)
      )
      .addCase(googleAuth.fulfilled, (state, action) =>
        resetIfOtherUser(state, action.payload.user.id)
      )
      .addCase(demoLogin.fulfilled, (state, action) =>
        resetIfOtherUser(state, action.payload.user.id)
      )

      .addCase(fetchAllUsers.pending, (state) => {
        state.adminUsersStatus = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.adminUsers = action.payload;
        state.adminUsersStatus = "succeeded";
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.adminUsersStatus = "failed";
        state.error = action.payload ?? "Failed to load users";
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.adminUsers = state.adminUsers.map((u) =>
          u._id === action.payload.user._id
            ? {
                ...action.payload.user,
                permissions: action.payload.settings.permissions,
              }
            : u
        );
      })

      .addCase(updatePermissions.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        if (
          state.settings &&
          String(state.settings.userId) === String(userId)
        ) {
          state.settings = action.payload;
        }
        state.adminUsers = state.adminUsers.map((u) =>
          u._id === userId
            ? { ...u, permissions: action.payload.permissions }
            : u
        );
      });
  },
});

export const { clearSettingsError, hydrateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
