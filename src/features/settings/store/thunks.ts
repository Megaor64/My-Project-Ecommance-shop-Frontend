import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type {
  AppearanceSettings,
  NotificationSettings,
  PermissionSettings,
  UserSettings,
} from "@/features/settings/types";
import type { AdminUser } from "@/features/settings/types";
import * as settingsService from "@/features/settings/services/settingsService";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export const fetchSettings = createAsyncThunk<
  UserSettings,
  string,
  { rejectValue: string }
>("settings/fetch", async (userId, { rejectWithValue }) => {
  try {
    return await settingsService.fetchSettings(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load settings"));
  }
});

export const updateAppearance = createAsyncThunk<
  UserSettings,
  { userId: string; appearance: AppearanceSettings },
  { rejectValue: string }
>("settings/updateAppearance", async ({ userId, appearance }, { rejectWithValue }) => {
  try {
    return await settingsService.updateAppearance(userId, appearance);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update appearance"));
  }
});

export const updateNotifications = createAsyncThunk<
  UserSettings,
  { userId: string; notifications: NotificationSettings },
  { rejectValue: string }
>(
  "settings/updateNotifications",
  async ({ userId, notifications }, { rejectWithValue }) => {
    try {
      return await settingsService.updateNotifications(userId, notifications);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update notifications")
      );
    }
  }
);

export const updatePermissions = createAsyncThunk<
  UserSettings,
  { userId: string; permissions: Partial<PermissionSettings> },
  { rejectValue: string }
>("settings/updatePermissions", async ({ userId, permissions }, { rejectWithValue }) => {
  try {
    return await settingsService.updatePermissions(userId, permissions);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update permissions"));
  }
});

export const updateUserRole = createAsyncThunk<
  { user: AdminUser; settings: UserSettings },
  { userId: string; role: "customer" | "admin" },
  { rejectValue: string }
>("settings/updateUserRole", async ({ userId, role }, { rejectWithValue }) => {
  try {
    return await settingsService.updateUserRole(userId, role);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update role"));
  }
});

export const fetchAllUsers = createAsyncThunk<
  AdminUser[],
  void,
  { rejectValue: string }
>("settings/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    return await settingsService.fetchAllUsers();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load users"));
  }
});

export const deleteAccount = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("settings/deleteAccount", async (userId, { rejectWithValue }) => {
  try {
    await settingsService.deleteAccount(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete account"));
  }
});
