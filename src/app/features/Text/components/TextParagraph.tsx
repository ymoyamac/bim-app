import { useShallow } from 'zustand/shallow';

import { TextLine, useTextStore } from '@/features/Text';

export function TextParagraph() {
    const lineIds = useTextStore(useShallow((state) => state.lines.map((line) => line.id)));

    return (
        <article className='flex flex-col justify-center items-center'>
            <div className='w-[40%] flex flex-col items-end'>
                {lineIds.map((id) => (
                    <TextLine key={id} id={id} name={id} textLineId={id} hasFocus={true} />
                ))}
                {lineIds.length === 0 && <TextLine key='new-line' hasFocus={true} />}
            </div>
        </article>
    );
}
