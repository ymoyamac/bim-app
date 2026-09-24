import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Note } from '@/models';

import { v7 as uuid } from 'uuid';

type NoteState = {
    notes: Note[];
    selectedNote: Note | undefined;
};

type NoteStoreActions = {
    getNoteById: (id: string) => Note | undefined;
    saveNote: (note: Note) => void;
    updateNote: (note: Note) => void;
    addNewRow: (id: string) => void;
};

type NoteStore = NoteState & NoteStoreActions;

export const useNoteStore = create<NoteStore>()(
    devtools((set, get) => ({
        notes: [],
        selectedNote: undefined,
        isFirstLine: true,
        getNoteById: (id) => get().notes.find((note) => note.id === id),
        saveNote: (note) => set((state) => ({ notes: [...state.notes, note] }), false, 'saveNote'),
        updateNote: (note) => set((state) => ({ notes: state.notes.map((n) => n.id === note.id ? { ...note, updatedAt: new Date() } : n) }), false, 'updateNote'),
        addNewRow: (id) => set((state) => ({ notes: addBlank(state, id) }), false, 'addNewRow')
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
    };

    return [...left, noteFound, blank, ...rigth];
}
