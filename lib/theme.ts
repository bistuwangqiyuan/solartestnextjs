export type Theme = 'dark' | 'light' | 'blue';

export const themes = {
  dark: {
    name: '黑色主题',
    description: '默认深色工业风格主题',
    css: {
      '--bg-primary': '#0f0f0f',
      '--bg-secondary': '#1a1a1a',
      '--bg-tertiary': '#262626',
      '--text-primary': '#ffffff',
      '--text-secondary': '#a3a3a3',
      '--text-muted': '#737373',
      '--border': '#404040',
      '--primary': '#3b82f6',
      '--primary-hover': '#2563eb',
      '--success': '#10b981',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--chart-1': '#3b82f6',
      '--chart-2': '#10b981',
      '--chart-3': '#f59e0b',
      '--chart-4': '#ef4444',
    }
  },
  light: {
    name: '白色主题',
    description: '明亮简洁的浅色主题',
    css: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--bg-tertiary': '#f1f5f9',
      '--text-primary': '#1e293b',
      '--text-secondary': '#64748b',
      '--text-muted': '#94a3b8',
      '--border': '#e2e8f0',
      '--primary': '#3b82f6',
      '--primary-hover': '#2563eb',
      '--success': '#10b981',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--chart-1': '#3b82f6',
      '--chart-2': '#10b981',
      '--chart-3': '#f59e0b',
      '--chart-4': '#ef4444',
    }
  },
  blue: {
    name: '蓝色主题',
    description: '专业的蓝色工业主题',
    css: {
      '--bg-primary': '#0c1220',
      '--bg-secondary': '#1a2332',
      '--bg-tertiary': '#253344',
      '--text-primary': '#e2e8f0',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--border': '#334155',
      '--primary': '#0ea5e9',
      '--primary-hover': '#0284c7',
      '--success': '#22c55e',
      '--warning': '#f59e0b',
      '--error': '#f87171',
      '--chart-1': '#0ea5e9',
      '--chart-2': '#22c55e',
      '--chart-3': '#f59e0b',
      '--chart-4': '#f87171',
    }
  }
};

export function applyTheme(theme: Theme) {
  const themeConfig = themes[theme];
  const root = document.documentElement;
  
  Object.entries(themeConfig.css).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  localStorage.setItem('theme', theme);
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme') as Theme;
  return stored && themes[stored] ? stored : 'dark';
}

export function initializeTheme() {
  if (typeof window === 'undefined') return;
  const theme = getStoredTheme();
  applyTheme(theme);
}
