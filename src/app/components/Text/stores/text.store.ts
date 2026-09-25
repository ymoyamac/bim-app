import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Models } from '@/components/Text';

import { v7 as uuid } from 'uuid';

type TextState = {
    lines: Models.TextLine[];
    selectedLine: string | undefined;
};

type TextStoreActions = {
    setSelectedLine: (id: string | undefined) => void;
    getLine: (id: string) => Models.TextLine | undefined;
    saveLine: (line: Models.TextLine) => void;
    updateLine: (line: Models.TextLine) => void;
    addNewRow: (id: string) => void;
    deleteLine: (id: string) => void;
};

type TextStore = TextState & TextStoreActions;

export const useTextStore = create<TextStore>()(
    devtools((set, get) => ({
        lines: [],
        selectedLine: undefined,
        setSelectedLine: (id) => set({ selectedLine: id }, false, 'setSelectedLine'),
        getLine: (id) => get().lines.find((line) => line.id === id),
        saveLine: (line) => set((state) => ({ lines: [...state.lines, line], selectedNote: line.id }), false, 'saveLine'),
        updateLine: (line) => set((state) => ({ lines: state.lines.map((n) => n.id === line.id ? { ...line, updatedAt: new Date() } : n), selectedLine: line.id }), false, 'updateLine'),
        addNewRow: (id) => set(
            (state) => {
                const lines = addBlank(state, id);
                const blank = lines[lines.findIndex((n) => n.id === id) + 1];
                return { lines, selectedLine: blank?.id ?? id };
            },
            false,
            'addNewRow',
        ),
        deleteLine: (id) => set(
            (state) => {
                const index = state.lines.findIndex((n) => n.id === id);
                const nextToSelect = state.lines[index - 1] ?? state.lines[index + 1];
                return {
                    lines: state.lines.filter((n) => n.id !== id),
                    selectedNote: nextToSelect?.id,
                };
            },
            false,
            'deleteLine'
        ),

    })),
);

function addBlank(state: TextStore, id: string): Models.TextLine[] {

    const lineFound = state.lines.find((line) => line.id === id);
    if (!lineFound) return state.lines;
    const end = state.lines.indexOf(lineFound);
    const isTheLastElement = end === state.lines.length - 1;

    const left = state.lines.slice(0, end);
    const rigth = state.lines.slice(isTheLastElement ? state.lines.length : end + 1);

    const blank: Models.TextLine = {
        id: uuid(),
        content: '',
        isPinned: false,
        hasIdentation: false,
        isActive: true,
        creationDate: new Date(),
        createdBy: '',
    };

    return [...left, lineFound, blank, ...rigth];
}
