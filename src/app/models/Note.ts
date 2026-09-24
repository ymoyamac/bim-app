export interface Note {
    id: string;
    title?: string;
    description: string;
    isCompleted: boolean;
    isPinned: boolean;
    isImportant: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    isActive: boolean;
}

export type NoteMap = Record<string, Note>;
