import { useContext } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import { AuthContext } from '@/context'

export function useLocalAuthentication() {
    const { hasBiometrics, isLoading } = useContext(AuthContext)

    const authenticate = async (message) => {
        if (!hasBiometrics) return

        const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: message
        })

        return success
    }

    return {
        isLoading,
        hasBiometrics,
        authenticate
    }
}
