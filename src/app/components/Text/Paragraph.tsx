import type { ReactNode } from 'react';
import { useShallow } from 'zustand/shallow';
import { TextLine } from '@/components';
import { useTextStore } from '@/components/Text';

export interface DayProps {
    children?: ReactNode;
}

export function Paragraph() {
    const notesIds = useTextStore(useShallow((state) => state.notes.map((n) => n.id)));

    return (
        <article className='flex flex-col justify-center items-center'>
            <div className='w-[40%] flex flex-col items-end'>
                {notesIds.map((id) => (
                    <TextLine key={id} id={id} name={id} noteId={id} hasFocus={true} />
                ))}
                {notesIds.length === 0 && <TextLine key='new-note' hasFocus={true} />}
            </div>
        </article>
    );
}
