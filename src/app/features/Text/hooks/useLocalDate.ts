import { useState } from 'react';
import type { LocalDate } from '@/components/Workspace';

const MONTHS: string[][] = [
    ['Junuary', 'Enero'],
    ['February', 'Febrero'],
    ['March', 'Marzo'],
    ['April', 'Abril'],
    ['May', 'Mayo'],
    ['June', 'Junio'],
    ['July', 'Julio'],
    ['August', 'Agosto'],
    ['September', 'Septiembre'],
    ['October', 'Octubre'],
    ['November', 'Noviembre'],
    ['December', 'Diciembre'],
];

const DAYS: string[][] = [
    ['Sunday', 'Domingo'],
    ['Moday', 'Lunes'],
    ['Tuesday', 'Martes'],
    ['Wednesday', 'Miércoles'],
    ['Thursday', 'Jueves'],
    ['Friday', 'Viernes'],
    ['Saturday', 'Sábado'],
];

export function useLocalDate() {
    const date = new Date();
    const day = getDayOfWeek(date.getDay());
    const dayOfMonth = date.getDate();
    const month = getMonthNames(date.getMonth());
    const year = date.getFullYear();

    const [localDate, _setLocalDate] = useState<LocalDate>({
        today: date,
        day,
        dayOfMonth,
        month,
        year,
    });

    function getDayOfWeek(day: number): string[] {
        return DAYS[day] ?? [];
    }

    function getMonthNames(month: number): string[] {
        return MONTHS[month] ?? [];
    }

    return {
        ...localDate,
        localDate,
    };
}
