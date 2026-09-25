import { useState, useRef, useEffect, memo } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useNoteStore } from '@/stores';
import type { Note } from '@/models';

import { v7 as uuid } from 'uuid';
import classNames from 'classnames';

export interface NoteRawProps {
    className?: string;
    id?: string;
    name?: string;
    noteId?: string;
    hasFocus?: boolean;
}

export const NoteRaw = memo(function NoteRaw({ noteId, hasFocus }: NoteRawProps) {
    const note = useNoteStore((s) => noteId ? s.notes.find((n) => n.id === noteId) : undefined);
    const getNoteById = useNoteStore((state) => state.getNoteById);
    const saveNote = useNoteStore((state) => state.saveNote);
    const updateNote = useNoteStore((state) => state.updateNote);
    const addNewRow = useNoteStore((state) => state.addNewRow);
    const deleteNote = useNoteStore((state) => state.deleteNote);
    const setSelectedNote = useNoteStore((state) => state.setSelectedNote);

    const [value, setValue] = useState<string>(note?.description ?? '');
    const ref = useRef<HTMLTextAreaElement>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        const savedValue = note?.description ?? '';
        if (value === savedValue) return;
        timerRef.current = setTimeout(() => {            
            
            if (note) {
                const noteFound = getNoteById(note.id)!;
                const noteToUpdate: Note = { ...noteFound, description: value };
                updateNote(noteToUpdate);
                return;
            }
            saveNote({
                id: uuid(),
                title: '',
                description: value,
                isCompleted: false,
                isPinned: false,
                isImportant: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 'default',
                updatedBy: 'default',
                isActive: true,
                hasIdentation: false,
            });
        }, 700);
        return () => clearTimeout(timerRef.current);
    }, [value]);

    const isFocused = useNoteStore((s) => note !== undefined && s.selectedNote === note.id);

    useEffect(() => {
        if (!isFocused) return;
        const el = ref.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
    }, [isFocused]);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setValue(event.target.value);
        const el = ref.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }

    function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
        console.log(event)
        if (event.key === 'Backspace' && value === '' && note) {
            event.preventDefault();
            deleteNote(note.id);
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const { notes } = useNoteStore.getState();
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            const index = notes.findIndex((n) => n.id === note?.id);
            const target = notes[index + offset];
            if (!target) return;
            setSelectedNote(target.id);
        }

        if (event.shiftKey) {
            if (event.key === 'Tab') {
                event.preventDefault();
                if (!note) return;
                const noteFound = getNoteById(note.id)!;
                updateNote({ ...noteFound, hasIdentation: false });
                return;
            }
        }

        if (event.key === 'Tab') {
            event.preventDefault();
            if (!note) {
                clearTimeout(timerRef.current);
                saveNote({
                    id: uuid(),
                    title: '',
                    description: value,
                    isCompleted: false,
                    isPinned: false,
                    isImportant: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: 'default',
                    updatedBy: 'default',
                    isActive: true,
                    hasIdentation: true,
                });
                return;
            }

            if (!note) return;
            const noteFound = getNoteById(note.id)!;
            updateNote({ ...noteFound, hasIdentation: true });
            return;
        }

        if (event.key === '/') {
            console.log('Show menu');
            return;
        }

        if (event.key !== 'Enter' || event.shiftKey) {
            return;
        }        

        event.preventDefault();
        clearTimeout(timerRef.current);

        if (note) {
            const noteFound = getNoteById(note.id)!;
            const noteToUpdate: Note = { ...noteFound, description: value };
            updateNote(noteToUpdate);
            addNewRow(note.id);
            return;
        }
        const newNote: Note = {
            id: uuid(),
            title: '',
            description: value,
            isCompleted: false,
            isPinned: false,
            isImportant: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'default',
            updatedBy: 'default',
            isActive: true,
            hasIdentation: false,
        };
        saveNote(newNote);
        addNewRow(newNote.id);
        setValue('');
    }

    function handleFocus(note?: Note) {
        if (!note) return;
        setSelectedNote(note.id);
    }

    return (
        <div className={classNames('mb-1 flex flex-row gap-2 group relative', {
                'w-full': !note?.hasIdentation,
                'w-[95%]': note?.hasIdentation,
            })}>
            <div className='flex justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-300 hover:cursor-pointer'>
                <span className='material-symbols-outlined opacity-40'>add</span>{' '}
            </div>

            <textarea
                className='w-full overflow-hidden resize-none placeholder:text-transparent hover:placeholder:text-gray-400'
                id={note?.id ?? 'new-note'}
                name={note?.id ?? 'new-note'}
                ref={ref}
                value={value}
                onChange={handleChange}
                rows={1}
                placeholder='Write / to see options...'
                onKeyDown={(e) => handleKeyPress(e)}
                autoFocus={hasFocus}
                onFocus={() => handleFocus(note)}
            />
        </div>
    );
})
