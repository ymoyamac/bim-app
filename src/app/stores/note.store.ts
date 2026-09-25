import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Note } from '@/models';

import { v7 as uuid } from 'uuid';

type NoteState = {
    notes: Note[];
    prevNote: string | undefined;
    selectedNote: string | undefined;
};

type NoteStoreActions = {
    setSelectedNote: (id: string | undefined) => void;
    getNoteById: (id: string) => Note | undefined;
    saveNote: (note: Note) => void;
    updateNote: (note: Note) => void;
    addNewRow: (id: string) => void;
    deleteNote: (id: string) => void;
};

type NoteStore = NoteState & NoteStoreActions;

export const useNoteStore = create<NoteStore>()(
    devtools((set, get) => ({
        notes: [],
        prevNote: undefined,
        selectedNote: undefined,
        isFirstLine: true,
        setSelectedNote: (id) => set({ selectedNote: id }, false, 'setSelectedNote'),
        getNoteById: (id) => get().notes.find((note) => note.id === id),
        saveNote: (note) => set((state) => ({ notes: [...state.notes, note], selectedNote: note.id }), false, 'saveNote'),
        updateNote: (note) => set((state) => ({ notes: state.notes.map((n) => n.id === note.id ? { ...note, updatedAt: new Date() } : n), selectedNote: note.id }), false, 'updateNote'),
        addNewRow: (id) => set(
            (state) => {
                const notes = addBlank(state, id);
                const blank = notes[notes.findIndex((n) => n.id === id) + 1];
                return { notes, selectedNote: blank?.id ?? id };
            },
            false,
            'addNewRow',
        ),
        deleteNote: (id) => set(
            (state) => {
                const index = state.notes.findIndex((n) => n.id === id);
                const nextToSelect = state.notes[index - 1] ?? state.notes[index + 1];
                return {
                    notes: state.notes.filter((n) => n.id !== id),
                    selectedNote: nextToSelect?.id,
                };
            },
            false,
            'deleteNote'
        ),

    })),
);

function addBlank(state: NoteStore, id: string): Note[] {

    const noteFound = state.notes.find((note) => note.id === id);
    if (!noteFound) return state.notes;
    const end = state.notes.indexOf(noteFound);
    const isTheLastElement = end === state.notes.length - 1;

    const left = state.notes.slice(0, end);
    const rigth = state.notes.slice(isTheLastElement ? state.notes.length : end + 1);

    const blank: Note = {
        id: uuid(),
        title: '',
        description: '',
        isCompleted: false,
        isPinned: false,
        isImportant: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'default',
        updatedBy: 'default',
        isActive: true,
        hasIdentation: false
    };

    return [...left, noteFound, blank, ...rigth];
}
