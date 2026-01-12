import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  initTheme: () => void
}

const STORAGE_KEY = 'untwist-theme'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  console.log('🎨 System theme detected:', isDark ? 'dark' : 'light')
  return isDark ? 'dark' : 'light'
}

function applyTheme(resolvedTheme: 'light' | 'dark') {
  const htmlElement = document.documentElement
  console.log('🎨 Applying theme:', resolvedTheme)
  console.log('🎨 HTML element before:', htmlElement.className)
  
  if (resolvedTheme === 'dark') {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
  
  console.log('🎨 HTML element after:', htmlElement.className)
  console.log('🎨 HTML classList contains dark:', htmlElement.classList.contains('dark'))
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  console.log('🎨 Stored theme from localStorage:', stored)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',

  setTheme: (theme) => {
    console.log('🎨 setTheme called with:', theme)
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
    console.log('🎨 Resolved theme:', resolvedTheme)
    
    localStorage.setItem(STORAGE_KEY, theme)
    console.log('🎨 Saved to localStorage:', theme)
    
    applyTheme(resolvedTheme)
    
    set({ theme, resolvedTheme })
    console.log('🎨 State updated - theme:', theme, 'resolvedTheme:', resolvedTheme)
  },

  initTheme: () => {
    console.log('🎨 initTheme called')
    const theme = getStoredTheme()
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
    console.log('🎨 Initial theme:', theme, 'resolved to:', resolvedTheme)
    
    applyTheme(resolvedTheme)
    set({ theme, resolvedTheme })

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      console.log('🎨 System theme changed')
      const currentTheme = get().theme
      if (currentTheme === 'system') {
        const newResolved = getSystemTheme()
        console.log('🎨 Updating to new system theme:', newResolved)
        applyTheme(newResolved)
        set({ resolvedTheme: newResolved })
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    
    console.log('🎨 Theme initialization complete')
  }
}))
