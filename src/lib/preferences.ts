export interface UserPreferences {
  theme: 'light' | 'dark'
  showStats: boolean
  showDocumentsList: boolean
  isDistractionFree: boolean
  currentDocumentId: string | null
  currentProjectId: string | null
  lastContent: string
  lastFileName: string
}

const PREFERENCES_KEY = 'writing-app-preferences'

const defaultPreferences: UserPreferences = {
  theme: 'light',
  showStats: true,
  showDocumentsList: false,
  isDistractionFree: false,
  currentDocumentId: null,
  currentProjectId: null,
  lastContent: '',
  lastFileName: 'Untitled Document',
}

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences
  }

  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultPreferences, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load preferences:', error)
  }

  return defaultPreferences
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const current = loadPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save preferences:', error)
  }
}

export function savePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  savePreferences({ [key]: value })
}