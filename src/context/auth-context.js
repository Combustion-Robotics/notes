import { createContext, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [hasBiometrics, setHasBiometrics] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const appState = useRef(AppState.currentState)

    const checkBiometrics = async () => {
        const [hasHardware, isEnrolled] = await Promise.all([
            LocalAuthentication.hasHardwareAsync(),
            LocalAuthentication.isEnrolledAsync()
        ])

        setHasBiometrics(hasHardware && isEnrolled)
        setIsLoading(false)
    }

    useEffect(() => {
        checkBiometrics()

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                checkBiometrics()
            }

            appState.current = nextAppState
        })

        return () => {
            subscription.remove()
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                hasBiometrics,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
