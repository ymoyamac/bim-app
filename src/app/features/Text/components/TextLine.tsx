import { memo } from 'react';

import { useText } from '@/features/Text';

import classNames from 'classnames';

export interface TextLineProps {
    className?: string;
    id?: string;
    name?: string;
    textLineId?: string;
    hasFocus?: boolean;
}

export const TextLine = memo(function TextLine({ textLineId, hasFocus }: TextLineProps) {
    const { textLineRef, line, content, handleChange, handleKeyDown, handleFocus } = useText(textLineId ?? '');

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
                ref={textLineRef}
                value={content}
                onChange={handleChange}
                rows={1}
                placeholder={`Write ${'\"/\"'} to see options...`}
                onKeyDown={(e) => handleKeyDown(e, textLineId)}
                autoFocus={hasFocus}
                onFocus={() => handleFocus(line)}
            />
        </div>
    );
})
