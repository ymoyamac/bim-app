import type React from 'react';
import { TextHeader, TextParagraph } from '@/features/Text';

export function TextContainer(): React.JSX.Element {
    return (
        <div className='flex flex-col'>
            <TextHeader />
            <TextParagraph />
        </div>
    );
}