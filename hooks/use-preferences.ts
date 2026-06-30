"use client"

import { useCallback, useEffect, useState } from "react"

export type PrintJobsTab = "all" | "completed" | "ongoing" | "not_started"

export interface AppPreferences {
  showFinancials: boolean
  showWaste: boolean
  showKpiCards: boolean
  defaultPrintJobsTab: PrintJobsTab
}

const PREFERENCES_STORAGE_KEY = "printrax-preferences"
const PREFERENCES_EVENT_NAME = "printrax-preferences-change"

export const defaultPreferences: AppPreferences = {
  showFinancials: true,
  showWaste: true,
  showKpiCards: true,
  defaultPrintJobsTab: "ongoing",
}

const isPrintJobsTab = (value: unknown): value is PrintJobsTab =>
  value === "all" ||
  value === "completed" ||
  value === "ongoing" ||
  value === "not_started"

const parsePreferences = (value: string | null): AppPreferences => {
  if (!value) {
    return defaultPreferences
  }

  try {
    const parsed = JSON.parse(value) as Partial<AppPreferences>

    return {
      showFinancials:
        typeof parsed.showFinancials === "boolean"
          ? parsed.showFinancials
          : defaultPreferences.showFinancials,
      showWaste:
        typeof parsed.showWaste === "boolean"
          ? parsed.showWaste
          : defaultPreferences.showWaste,
      showKpiCards:
        typeof parsed.showKpiCards === "boolean"
          ? parsed.showKpiCards
          : defaultPreferences.showKpiCards,
      defaultPrintJobsTab: isPrintJobsTab(parsed.defaultPrintJobsTab)
        ? parsed.defaultPrintJobsTab
        : defaultPreferences.defaultPrintJobsTab,
    }
  } catch {
    return defaultPreferences
  }
}

const readPreferences = () => {
  if (typeof window === "undefined") {
    return defaultPreferences
  }

  return parsePreferences(window.localStorage.getItem(PREFERENCES_STORAGE_KEY))
}

const writePreferences = (preferences: AppPreferences) => {
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
  window.dispatchEvent(
    new CustomEvent<AppPreferences>(PREFERENCES_EVENT_NAME, {
      detail: preferences,
    })
  )
}

export function usePreferences() {
  const [preferences, setPreferencesState] =
    useState<AppPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const nextPreferences = readPreferences()
    setPreferencesState(nextPreferences)
    setIsLoaded(true)

    const handlePreferenceChange = (event: Event) => {
      const customEvent = event as CustomEvent<AppPreferences>
      setPreferencesState(customEvent.detail ?? readPreferences())
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PREFERENCES_STORAGE_KEY) {
        setPreferencesState(parsePreferences(event.newValue))
      }
    }

    window.addEventListener(PREFERENCES_EVENT_NAME, handlePreferenceChange)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener(PREFERENCES_EVENT_NAME, handlePreferenceChange)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const setPreferences = useCallback(
    (nextPreferences: AppPreferences) => {
      setPreferencesState(nextPreferences)
      writePreferences(nextPreferences)
    },
    []
  )

  const updatePreference = useCallback(
    <Key extends keyof AppPreferences>(key: Key, value: AppPreferences[Key]) => {
      setPreferences({
        ...preferences,
        [key]: value,
      })
    },
    [preferences, setPreferences]
  )

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
  }, [setPreferences])

  return {
    preferences,
    isLoaded,
    setPreferences,
    updatePreference,
    resetPreferences,
  }
}
