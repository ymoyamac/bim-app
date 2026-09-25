import { useState, useRef, useEffect, memo } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useTextStore, type Text } from '@/components/Text';

import { v7 as uuid } from 'uuid';
import classNames from 'classnames';

export interface TextLineProps {
    className?: string;
    id?: string;
    name?: string;
    textLineId?: string;
    hasFocus?: boolean;
}

export const TextLine = memo(function TextLine({ textLineId, hasFocus }: TextLineProps) {
    const textLine = useTextStore((s) => textLineId ? s.notes.find((n) => n.id === textLineId) : undefined);
    const getNoteById = useTextStore((state) => state.getNoteById);
    const saveNote = useTextStore((state) => state.saveNote);
    const updateNote = useTextStore((state) => state.updateNote);
    const addNewRow = useTextStore((state) => state.addNewRow);
    const deleteNote = useTextStore((state) => state.deleteNote);
    const setSelectedNote = useTextStore((state) => state.setSelectedNote);

    const [value, setValue] = useState<string>(note?.description ?? '');
    const ref = useRef<HTMLTextAreaElement>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        const savedValue = note?.description ?? '';
        if (value === savedValue) return;
        timerRef.current = setTimeout(() => {            
            
            if (note) {
                const noteFound = getNoteById(note.id)!;
                const noteToUpdate: Text = { ...noteFound, description: value };
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

    const isFocused = useTextStore((s) => note !== undefined && s.selectedNote === note.id);

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
            const { notes } = useTextStore.getState();
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
            const noteToUpdate: Text = { ...noteFound, description: value };
            updateNote(noteToUpdate);
            addNewRow(note.id);
            return;
        }
        const newNote: Text = {
            uuid: uuid(),
            content: value,
            isPinned: false,
            hasIdentation: false,
            isActive: true,
            creationDate: new Date(),
            createdBy: '',
        };
        saveNote(newNote);
        addNewRow(newNote.uuid);
        setValue('');
    }

    function handleFocus(note?: Text) {
        if (!note) return;
        setSelectedNote(note.uuid);
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
