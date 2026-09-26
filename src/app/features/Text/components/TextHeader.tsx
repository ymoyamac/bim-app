import { useLocalDate } from '@/features/Text';

export function TextHeader() {

    const { dayOfMonth, day, month, year } = useLocalDate();

    return (
        <header className='w-full flex flex-row gap-5 justify-start items-center'>
            <div className='py-5 px-6 border border-indigo-500 rounded-full text-center'>
                {dayOfMonth}
            </div>
            <h5 className='w-48'>
                {day[0]}, {month[0]} <span>{year}</span>
            </h5>
            <div className='border border-indigo-500 rounded-md w-full'></div>
        </header>
    );
}
