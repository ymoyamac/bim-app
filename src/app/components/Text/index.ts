
export * from './stores';

export { TextLine } from './TextLine';
export { TextParagraph } from './TextParagraph';

import { v7 as uuid } from 'uuid';

export namespace Def {
    
    export interface Text {
        uuid: string;
        textDate: TextDate;
        paragraphs: TextParagraph[] | TextParagraph;
    }

    export interface TextDate {
        today: Date | null;
        day: string[];
        dayOfMonth: number;
        month: string[];
        year: number;
    }

    export interface TextParagraph {
        uuid: string;
        textLines: TextLine[] | TextLine;
    }

    export interface TextLine {
        id: string;
        content: string;
        isPinned: boolean;
        hasIdentation: boolean;
        isActive: boolean;
        creationDate: Date;
        createdBy: string;
    }

    export function buildTextLine(overrides: Partial<TextLine> = {}): TextLine {
        return {
            id: uuid(),
            content: '',
            isPinned: false,
            hasIdentation: false,
            isActive: true,
            creationDate: new Date(),
            createdBy: '',
            ...overrides
        };
    }

}
