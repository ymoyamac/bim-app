import type { ReactNode } from 'react';
import { useShallow } from 'zustand/shallow';
import { NoteDay, NoteRaw } from '@/components';
import { useLocalDate } from '@/hooks';
import { useNoteStore } from '@/stores';

export interface DayProps {
    children?: ReactNode;
}

export function NoteContainer() {
    const { day, dayOfMonth, month, year } = useLocalDate();

    const notesIds = useNoteStore(useShallow((state) => state.notes.map((n) => n.id)));

    return (
        <article className='flex flex-col justify-center items-center'>
            <NoteDay
                day={day[0] ?? ''}
                dayOfMonth={dayOfMonth}
                month={month[0] ?? ''}
                year={year}
            />

            <div className='w-[40%] flex flex-col items-end'>
                {notesIds.map((id) => (
                    <NoteRaw key={id} id={id} name={id} noteId={id} hasFocus={true} />
                ))}
                {notesIds.length === 0 && <NoteRaw key='new-note' hasFocus={true} />}
            </div>
        </article>
    );
}
