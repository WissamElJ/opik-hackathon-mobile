export const Colors = {
  // App Design System - Dark Theme
  background: '#000000',
  primaryAccent: '#8B80F9',
  inputBackground: '#1F1F1F',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textPlaceholder: '#666666',

  // UI Elements
  divider: '#333333',
  buttonSecondary: '#1F1F1F',

  // Tab Bar Colors
  tabBarBackground: '#252525',
  tabBarActive: '#8B5CF6',
  tabBarInactive: '#A0A0A0',

  // Border Radius
  borderRadius: 12,
} as const;

export type AppColors = typeof Colors;
