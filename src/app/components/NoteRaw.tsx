import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useNoteStore } from '@/stores';
import type { Note } from '@/models';

import { v7 as uuid } from 'uuid';

export interface NoteRawProps {
    className?: string;
    id?: string;
    name?: string;
    note?: Note;
    hasFocus?: boolean;
}

export function NoteRaw({ note, hasFocus }: NoteRawProps) {
    const getNoteById = useNoteStore((state) => state.getNoteById);
    const saveNote = useNoteStore((state) => state.saveNote);
    const updateNote = useNoteStore((state) => state.updateNote);
    const addNewRow = useNoteStore((state) => state.addNewRow);

    const [value, setValue] = useState<string>(note?.description ?? '');
    const ref = useRef<HTMLTextAreaElement>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        const savedValue = note?.description ?? '';
        if (value === '' || value === savedValue) return;
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
            });
        }, 2000);
        return () => clearTimeout(timerRef.current);
    }, [value]);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setValue(event.target.value);
        const el = ref.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }

    function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
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
        const newNote = {
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
        };
        saveNote(newNote);
        addNewRow(newNote.id);
        setValue('');
    }

    function handleFocus(note?: Note) {
        if (!note) return;
    }

    return (
        <div className='m-2 flex flex-row gap-2 group relative'>
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
}
