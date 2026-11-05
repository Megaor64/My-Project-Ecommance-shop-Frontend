import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AppearanceSettings,
  NotificationSettings,
  PermissionSettings,
  UserSettings,
} from "@/features/settings/types";
import type { AdminUser } from "@/features/settings/types";
import * as settingsService from "@/features/settings/services/settingsService";
import { rejectMessage } from "@/lib/i18n";
import type { RootState } from "@/store";

export const fetchSettings = createAsyncThunk<
  UserSettings,
  string,
  { state: RootState; rejectValue: string }
>("settings/fetch", async (userId, { getState, rejectWithValue }) => {
  try {
    return await settingsService.fetchSettings(userId);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "settings.loadFailed")
    );
  }
});

export const updateAppearance = createAsyncThunk<
  UserSettings,
  { userId: string; appearance: AppearanceSettings },
  { state: RootState; rejectValue: string }
>("settings/updateAppearance", async ({ userId, appearance }, { getState, rejectWithValue }) => {
  try {
    return await settingsService.updateAppearance(userId, appearance);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "settings.saveFailed")
    );
  }
});

export const updateNotifications = createAsyncThunk<
  UserSettings,
  { userId: string; notifications: NotificationSettings },
  { state: RootState; rejectValue: string }
>(
  "settings/updateNotifications",
  async ({ userId, notifications }, { getState, rejectWithValue }) => {
    try {
      return await settingsService.updateNotifications(userId, notifications);
    } catch (error) {
      return rejectWithValue(
        rejectMessage(error, getState(), "settings.saveFailed")
      );
    }
  }
);

export const updatePermissions = createAsyncThunk<
  UserSettings,
  { userId: string; permissions: Partial<PermissionSettings> },
  { state: RootState; rejectValue: string }
>("settings/updatePermissions", async ({ userId, permissions }, { getState, rejectWithValue }) => {
  try {
    return await settingsService.updatePermissions(userId, permissions);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.users.permissionsFailed")
    );
  }
});

export const updateUserRole = createAsyncThunk<
  { user: AdminUser; settings: UserSettings },
  { userId: string; role: "customer" | "admin" },
  { state: RootState; rejectValue: string }
>("settings/updateUserRole", async ({ userId, role }, { getState, rejectWithValue }) => {
  try {
    return await settingsService.updateUserRole(userId, role);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.users.roleFailed")
    );
  }
});

export const fetchAllUsers = createAsyncThunk<
  AdminUser[],
  void,
  { state: RootState; rejectValue: string }
>("settings/fetchAllUsers", async (_, { getState, rejectWithValue }) => {
  try {
    return await settingsService.fetchAllUsers();
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.users.loadFailed")
    );
  }
});

export const deleteAccount = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>("settings/deleteAccount", async (userId, { getState, rejectWithValue }) => {
  try {
    await settingsService.deleteAccount(userId);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "settings.security.deleteFailed")
    );
  }
});
