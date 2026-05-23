import type { RootState } from "@/store";

export const selectSettings = (state: RootState) => state.settings.settings;
export const selectSettingsStatus = (state: RootState) => state.settings.status;
export const selectSettingsSaveStatus = (state: RootState) =>
  state.settings.saveStatus;
export const selectSettingsError = (state: RootState) => state.settings.error;
export const selectAdminUsers = (state: RootState) => state.settings.adminUsers;
export const selectAdminUsersStatus = (state: RootState) =>
  state.settings.adminUsersStatus;
