import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UtilsContext } from './utils-contex'
import { DEFAULT_CATEGORIES, STORAGE_KEYS } from '@/constants'

export const NoteContext = createContext()

export function NoteProvider({ children }) {
    const { setPinned, setSort } = useContext(UtilsContext)

    const [notes, setNotes] = useState([])
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
    const [trash, setTrash] = useState(new Set())
    const [paramId, setParamId] = useState('')
    const [loading, setLoading] = useState(true)

    // Load everything once, in a single storage read
    useEffect(() => {
        (async () => {
            try {
                const entries = await AsyncStorage.multiGet([
                    STORAGE_KEYS.NOTES,
                    STORAGE_KEYS.CATEGORIES,
                    STORAGE_KEYS.TRASH,
                    STORAGE_KEYS.PINNED,
                    STORAGE_KEYS.SORT
                ])

                const [notes, categories, trash, pinned, sort] = entries.map(([, value]) => value)

                if (notes) setNotes(JSON.parse(notes))
                if (categories) setCategories(JSON.parse(categories))
                if (pinned) setPinned(new Set(JSON.parse(pinned)))
                if (sort) setSort(JSON.parse(sort))

                if (trash) {
                    const parsed = JSON.parse(trash)
                    const array = Array.isArray(parsed) ? parsed
                        : Object.values(parsed)

                    setTrash(new Set(array))
                }
            } catch (error) {
                console.error('Error loading notes:', error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <NoteContext.Provider
            value={{
                notes,
                setNotes,
                categories,
                setCategories,
                trash,
                setTrash,
                paramId,
                setParamId,
                loading
            }}
        >
            {children}
        </NoteContext.Provider>
    )
}
