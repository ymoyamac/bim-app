import { Outlet } from 'react-router';

export function RootLayout() {
    return (
        <main className='h-screen w-screen flex justify-center'>
            <Outlet />
        </main>
    );
}
