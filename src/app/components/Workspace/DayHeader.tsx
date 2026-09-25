interface DayHeaderProps {
    today: Date | null;
    day: string[];
    dayOfMonth: number;
    month: string[];
    year: number;
}

export function DayHeader({ day, dayOfMonth, month, year }: DayHeaderProps) {
    return (
        <header className='w-full flex flex-row gap-5 justify-start items-center'>
            <div className='py-5 px-6 border border-indigo-500 rounded-full text-center'>
                {dayOfMonth}
            </div>
            <h5 className='w-48'>
                {day}, {month} <span>{year}</span>
            </h5>
            <div className='border border-indigo-500 rounded-md w-full'></div>
        </header>
    );
}
