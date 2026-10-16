import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useLanguage, useStorage } from '@/hooks'
import { ThemeProvider } from '@/context'
import { STORAGE_KEYS, THEMES } from '@/constants'
import Providers from './providers'

// Keep the splash up until theme + language are ready, so the tree renders once
SplashScreen.preventAutoHideAsync()

export default function MainLayout() {
    const colorScheme = useColorScheme()
    const { initLanguage } = useLanguage()
    const { getItem } = useStorage()
    const [initialTheme, setInitialTheme] = useState(null)

    useEffect(() => {
        (async () => {
            const [mode] = await Promise.all([
                getItem(STORAGE_KEYS.THEME),
                initLanguage()
            ])

            const themeMode = mode || 'system'
            const name = themeMode !== 'system' ? themeMode : colorScheme
            setInitialTheme({ mode: themeMode, name, theme: THEMES[name] })
        })()
    }, [])

    useEffect(() => {
        if (initialTheme) SplashScreen.hideAsync()
    }, [initialTheme])

    if (!initialTheme) return null

    return (
        <ThemeProvider initialTheme={initialTheme}>
            <Providers>
                <Slot />
            </Providers>
        </ThemeProvider>
    )
}
