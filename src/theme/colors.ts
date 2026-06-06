export type ThemeColors = {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryText: string;
  success: string;
  successText: string;
  danger: string;
  dangerText: string;
  border: string;
  icon: string;
  tagBackground: string;
  tagBorder: string;
  tagText: string;
};

export const lightColors: ThemeColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceVariant: '#e9ecef',
  text: '#212529',
  textSecondary: '#6c757d',
  primary: '#0d6efd',
  primaryText: '#ffffff',
  success: '#198754',
  successText: '#ffffff',
  danger: '#dc3545',
  dangerText: '#ffffff',
  border: '#dee2e6',
  icon: '#495057',
  tagBackground: '#e0f2fe',
  tagBorder: '#bae6fd',
  tagText: '#0369a1',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  surfaceVariant: '#2c2c2c',
  text: '#f8f9fa',
  textSecondary: '#adb5bd',
  primary: '#3b82f6',
  primaryText: '#ffffff',
  success: '#20c997',
  successText: '#121212',
  danger: '#ef4444',
  dangerText: '#ffffff',
  border: '#343a40',
  icon: '#ced4da',
  tagBackground: '#0c4a6e',
  tagBorder: '#075985',
  tagText: '#38bdf8',
};
