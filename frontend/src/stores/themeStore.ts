// Theme store — manages dark/light mode across the entire app
// Usage in any component: const { theme, toggleTheme } = useThemeStore()

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light')
  } else {
    root.removeAttribute('data-theme')
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark'
          applyTheme(next)
          return { theme: next }
        }),

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'theme-preference', // saved in localStorage
      onRehydrateStorage: () => (state) => {
        // Apply saved theme on page load
        if (state) applyTheme(state.theme)
      },
    }
  )
)
