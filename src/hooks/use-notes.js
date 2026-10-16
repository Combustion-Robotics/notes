import { useContext } from 'react'
import { useStorage } from './use-storage'
import { NoteContext } from '@/context'
import { STORAGE_KEYS } from '@/constants'

export function useNotes() {
    const { notes, setNotes, paramId, setParamId, loading } = useContext(NoteContext)
    const { setItem } = useStorage()

    const saveNote = (note) => {
        const localNotes = [note, ...notes]
        updateBackup(localNotes)
    }

    const saveNotes = (items) => {
        const localNotes = [...items, ...notes]
        updateBackup(localNotes)
    }

    const deleteNote = (id) => {
        const localNotes = notes.filter((note) => note.id !== id)
        updateBackup(localNotes)
    }

    const updateNote = (note) => {
        const localNotes = notes.map((n) => {
            if (n.id === note.id) return note
            return n
        })

        updateBackup(localNotes)
    }

    const getNote = (id) => {
        return notes.find((note) => note.id === id) || {}
    }

    const updateBackup = async (localNotes) => {
        setNotes(localNotes)
        await setItem(STORAGE_KEYS.NOTES, JSON.stringify(localNotes))
    }

    return {
        notes,
        getNote,
        saveNote,
        saveNotes,
        deleteNote,
        updateNote,
        paramId,
        setParamId,
        loading
    }
}
