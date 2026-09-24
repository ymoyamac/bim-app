import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/layouts/RootLayout';
import { WorkspacePage } from '@/pages/WorkspacePage';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                path: '/workspace',
                Component: WorkspacePage,
            },
        ],
    },
]);
