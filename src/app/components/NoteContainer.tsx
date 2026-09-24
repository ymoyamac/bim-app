import type { ReactNode } from 'react';
import { NoteDay, NoteRaw } from '@/components';
import { useLocalDate } from '@/hooks';
import { useNoteStore } from '@/stores';

export interface DayProps {
    children?: ReactNode;
}

export function NoteContainer() {
    const { day, dayOfMonth, month, year } = useLocalDate();

    const notes = useNoteStore((state) => state.notes);

    return (
        <article className='mt-2 flex flex-col justify-center items-center'>
            <NoteDay
                day={day[0] ?? ''}
                dayOfMonth={dayOfMonth}
                month={month[0] ?? ''}
                year={year}
            />

            <div className='w-[90%]'>
                {notes.map((note) => (
                    <NoteRaw key={note.id} id={note.id} name={note.id} note={note} hasFocus={true} />
                ))}
                {notes.length === 0 && <NoteRaw key='new-note' hasFocus={true} />}
            </div>
        </article>
    );
}
