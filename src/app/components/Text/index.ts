
export * from './stores';

export { TextLine } from './TextLine';
export { Paragraph } from './Paragraph';

export namespace Models {
    
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

}
