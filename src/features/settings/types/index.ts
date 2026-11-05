export type Theme = "light" | "dark" | "system";
export type Language = "he" | "en" | "ar";
export type FontSize = "small" | "medium" | "large";

export type AppearanceSettings = {
  theme: Theme;
  language: Language;
  fontSize: FontSize;
  compactMode: boolean;
  currency: string;
};

export type EmailNotifications = {
  orderUpdates: boolean;
  marketing: boolean;
  newsletter: boolean;
};

export type BrowserNotifications = {
  orderUpdates: boolean;
  promotions: boolean;
};

export type SmsNotifications = {
  orderUpdates: boolean;
  promotions: boolean;
  phone: string;
};

export type NotificationSettings = {
  email: EmailNotifications;
  browser: BrowserNotifications;
  sms: SmsNotifications;
};

export type PermissionSettings = {
  canSell: boolean;
  canManageUsers: boolean;
  canManageProducts: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  twoFactorEnabled: boolean;
};

export type UserSettings = {
  _id: string;
  userId: string;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  permissions: PermissionSettings;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "demo-admin";
  isVerified: boolean;
  isActive?: boolean;
  createdAt?: string;
  permissions?: PermissionSettings;
};
