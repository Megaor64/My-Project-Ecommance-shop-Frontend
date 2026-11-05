import type { RootState } from "@/store";
import { DEFAULT_APPEARANCE } from "@/lib/appearance";
import type { AppearanceSettings } from "@/features/settings/types";

export const selectSettings = (state: RootState) => state.settings.settings;
/** Saved appearance of the signed-in user, or the defaults for visitors. */
export const selectAppearance = (state: RootState): AppearanceSettings =>
  state.settings.settings?.appearance ?? DEFAULT_APPEARANCE;
export const selectSettingsStatus = (state: RootState) => state.settings.status;
export const selectSettingsSaveStatus = (state: RootState) =>
  state.settings.saveStatus;
export const selectSettingsError = (state: RootState) => state.settings.error;
export const selectAdminUsers = (state: RootState) => state.settings.adminUsers;
export const selectAdminUsersStatus = (state: RootState) =>
  state.settings.adminUsersStatus;
