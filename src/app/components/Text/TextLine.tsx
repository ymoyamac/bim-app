import { useState, useRef, useEffect, memo } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { type Types, useTextStore, buildTextLine } from '@/components/Text';

import classNames from 'classnames';

export interface TextLineProps {
    className?: string;
    id?: string;
    name?: string;
    textLineId?: string;
    hasFocus?: boolean;
}

export const TextLine = memo(function TextLine({ textLineId, hasFocus }: TextLineProps) {
    const line = useTextStore((s) => textLineId ? s.lines.find((n) => n.id === textLineId) : undefined);
    const setSelectedLine = useTextStore((state) => state.setSelectedLine);
    const getLine = useTextStore((state) => state.getLine);
    const saveLine = useTextStore((state) => state.saveLine);
    const updateLine = useTextStore((state) => state.updateLine);
    const addNewRow = useTextStore((state) => state.addNewRow);
    const deleteLine = useTextStore((state) => state.deleteLine);
    const isFocused = useTextStore((state) => line !== undefined && state.selectedLine === line.id);

    const [content, setContent] = useState<string>(line?.content ?? '');
    const ref = useRef<HTMLTextAreaElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        const savedValue = line?.content ?? '';
        if (content === savedValue) return;
        timerRef.current = setTimeout(() => {            
            
            if (line) {
                const lineFound = getLine(line.id)!;
                const noteToUpdate: Types.TextLine = { ...lineFound, content };
                updateLine(noteToUpdate);
                return;
            }
            saveLine(buildTextLine());
        }, 700);
        return () => clearTimeout(timerRef.current);
    }, [content]);

    useEffect(() => {
        if (!isFocused) return;
        const el = ref.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
    }, [isFocused]);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);
        const el = ref.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }

    function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Backspace' && content === '' && line) {
            event.preventDefault();
            deleteLine(line.id);
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const { lines } = useTextStore.getState();
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            const index = lines.findIndex((n) => n.id === line?.id);
            const target = lines[index + offset];
            if (!target) return;
            setSelectedLine(target.id);
        }

        if (event.shiftKey) {
            if (event.key === 'Tab') {
                event.preventDefault();
                if (!line) return;
                const lineFound = getLine(line.id)!;
                updateLine({ ...lineFound, hasIdentation: false });
                return;
            }
        }

        if (event.key === 'Tab') {
            event.preventDefault();
            if (!line) {
                clearTimeout(timerRef.current);
                saveLine(buildTextLine());
                return;
            }

            if (!line) return;
            const lineFound = getLine(line.id)!;
            updateLine({ ...lineFound, hasIdentation: true });
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

        if (line) {
            const lineFound = getLine(line.id)!;
            const lineToUpdate: Types.TextLine = { ...lineFound, content };
            updateLine(lineToUpdate);
            addNewRow(line.id);
            return;
        }
        const newLine: Types.TextLine = buildTextLine({ content });
        saveLine(newLine);
        addNewRow(newLine.id);
        setContent('');
    }

    function handleFocus(line?: Types.TextLine) {
        if (!line) return;
        setSelectedLine(line.id);
    }

    return (
        <div className={classNames('mb-1 flex flex-row gap-2 group relative', {
                'w-full': !line?.hasIdentation,
                'w-[95%]': line?.hasIdentation,
            })}>
            <div className='flex justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-300 hover:cursor-pointer'>
                <span className='material-symbols-outlined opacity-40'>add</span>{' '}
            </div>

            <textarea
                className='w-full overflow-hidden resize-none placeholder:text-transparent hover:placeholder:text-gray-400'
                id={line?.id ?? 'new-line'}
                name={line?.id ?? 'new-line'}
                ref={ref}
                value={content}
                onChange={handleChange}
                rows={1}
                placeholder={`Write ${'\"/\"'} to see options...`}
                onKeyDown={(e) => handleKeyPress(e)}
                autoFocus={hasFocus}
                onFocus={() => handleFocus(line)}
            />
        </div>
    );
})
