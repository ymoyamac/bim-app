import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { buildTextLine, type Types, useTextStore } from '@/features/Text';

type Event = KeyboardEvent<HTMLTextAreaElement>;

type KeyHandler = Record<string, (event: Event, id: string) => void>;

export function useText(id: string) {

    const line = useTextStore((s) => id ? s.lines.find((n) => n.id === id) : undefined);

    const setSelectedLine = useTextStore((state) => state.setSelectedLine);
    const getLine = useTextStore((state) => state.getLine);
    const saveLine = useTextStore((state) => state.saveLine);
    const updateLine = useTextStore((state) => state.updateLine);
    const deleteLine = useTextStore((state) => state.deleteLine);
    const addNewRow = useTextStore((state) => state.addNewRow);
    const isFocused = useTextStore((state) => line !== undefined && state.selectedLine === line.id);

    const [content, setContent] = useState<string>(line?.content ?? '');
    const textLineRef = useRef<HTMLTextAreaElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        const savedValue = line?.content ?? '';
        if (content === savedValue) return;
        timerRef.current = setTimeout(() => {            
            if (line) {
                _update({ content });
                return;
            }
            saveLine(buildTextLine({ content }));
        }, 700);
        return () => clearTimeout(timerRef.current);
    }, [content]);

    useEffect(() => {
        if (!isFocused) return;
        const el = textLineRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
    }, [isFocused]);

    const _keyHandlers: KeyHandler = {
        Backspace: _handleKeyBackSpace,
        Tab: _handleKeyTab,
        ArrowDown: _handleKeyArrow,
        ArrowUp: _handleKeyArrow,
        Enter: _handleKeyEnter,
    };

    function _update(changes: Partial<Types.TextLine>) {
        const currentLine = getLine(id);
        if (!currentLine) {
            saveLine(buildTextLine());
            return;
        };
        updateLine({ ...currentLine, ...changes });
    }

    function _handleKeyBackSpace(event: Event, id: string): void {
        if (content !== '' && line) return;
        event.preventDefault();
        deleteLine(id);
    }

    function _handleKeyArrow(event: Event): void {
        const { lines } = useTextStore.getState();
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        const nextLine = lines[lines.findIndex((l) => l.id === line?.id) + offset];
        setSelectedLine(nextLine?.id);
    }

    function _handleKeyTab(event: Event): void {
        event.preventDefault();
        clearTimeout(timerRef.current);
        const hasIdentation = !event.shiftKey;
        _update({ hasIdentation });
    }

    function _handleKeyEnter(event: Event): void {
        if (event.shiftKey) return;
        event.preventDefault();
        clearTimeout(timerRef.current);

        if (line) {
            _update({ content });
            addNewRow(line.id);
            return;
        }

        const newLine: Types.TextLine = buildTextLine({ content });
        saveLine(newLine);
        addNewRow(newLine.id);
        setContent('');
    }

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setContent(event.target.value);
        const el = textLineRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    }

    function handleKeyDown(event: Event, id?: string): void {
        _keyHandlers[event.key]?.(event, id ?? '');
    }

    function handleFocus(line?: Types.TextLine) {
        if (!line) return;
        setSelectedLine(line.id);
    }

    return {
        textLineRef,
        line,
        content,
        handleChange,
        handleKeyDown,
        handleFocus,
    };
}