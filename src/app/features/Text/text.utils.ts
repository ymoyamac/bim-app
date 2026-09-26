import { v7 as uuid } from 'uuid';
import type { Types } from '@/features/Text';

export function buildTextLine(overrides: Partial<Types.TextLine> = {}) {
    return {
        id: uuid(),
        content: '',
        isPinned: false,
        hasIdentation: false,
        isActive: true,
        creationDate: new Date(),
        createdBy: '',
        ...overrides
    }
}